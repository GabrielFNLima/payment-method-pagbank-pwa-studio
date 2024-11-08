import { useCallback, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useIntl } from 'react-intl';
import { useToasts } from '@magento/peregrine';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import defaultOperations from './pix.gql';
import usePayer from '../PayerForm/usePayer';

/**
 * Talon to manage PIX payment information, including payer details and
 * handling of store configurations for the PIX payment method in the checkout flow.
 *
 * @param {Object} props - Optional configuration for the hook.
 * @param {Function} props.onSuccess - Callback invoked upon successful payment method update.
 * @param {Function} props.onReady - Callback invoked when the component is ready.
 * @param {Function} props.onError - Callback invoked on error during payment processing.
 * @param {boolean} props.shouldSubmit - Flag indicating if the form should submit.
 * @param {Function} props.resetShouldSubmit - Callback to reset the shouldSubmit flag.
 * @param {Object} [props.operations] - Custom GraphQL operations to override defaults.
 *
 * @returns {Object} An object containing instructions, payer form configuration, and billing handlers.
 * @property {string} instruction - Formatted instruction text based on store configuration.
 * @property {Object} payerForm - Configuration for payer form fields and handlers.
 * @property {Function} onBillingAddressChangedError - Callback to handle errors when billing address changes.
 * @property {Function} onBillingAddressChangedSuccess - Callback to handle successful billing address change.
 */
export const usePix = props => {
    const {
        onSuccess,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit
    } = props;

    const operations = mergeOperations(defaultOperations, props.operations);

    const {
        getStoreConfigQuery,
        setPagBankPixPaymentMethodMutation
    } = operations;

    const [{ cartId }] = useCartContext();
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const {
        payerTaxId,
        payerName,
        payerPhone,
        handlePayerTaxId,
        setPayerName: handlePayerName,
        setPayerPhone: handlePayerPhone
    } = usePayer();

    const { data: storeConfigPix } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const [
        updatePaymentMethod,
        {
            error: paymentMethodMutationError,
            called: paymentMethodMutationCalled,
            loading: paymentMethodMutationLoading
        }
    ] = useMutation(setPagBankPixPaymentMethodMutation);

    const payerForm = useMemo(() => {
        return {
            hasTaxIdCapture: true,
            hasNameCapture:
                storeConfigPix.storeConfig
                    .pagbank_paymentmagento_pix_payer_name,
            hasPhoneCapture:
                storeConfigPix.storeConfig
                    .pagbank_paymentmagento_pix_payer_phone,
            handlePayerTaxId,
            handlePayerName,
            handlePayerPhone
        };
    }, [storeConfigPix, handlePayerTaxId, handlePayerName, handlePayerPhone]);

    const instruction = useMemo(() => {
        const exp =
                storeConfigPix.storeConfig
                    .pagbank_paymentmagento_pix_expiration,
            text =
                storeConfigPix.storeConfig
                    .pagbank_paymentmagento_pix_instruction_checkout;
        const times = {
            15: formatMessage({
                id: 'pagBankPix.15Minutes',
                defaultMessage: '15 minutes'
            }),
            30: formatMessage({
                id: 'pagBankPix.30Minutes',
                defaultMessage: '30 minutes'
            }),
            60: formatMessage({
                id: 'pagBankPix.1Hour',
                defaultMessage: '1 hour'
            }),
            720: formatMessage({
                id: 'pagBankPix.12Hour',
                defaultMessage: '12 hour'
            }),
            1440: formatMessage({
                id: 'pagBankPix.1Day',
                defaultMessage: '1 day'
            }),
            4320: formatMessage({
                id: 'pagBankPix.3Day',
                defaultMessage: '3 day'
            })
        };

        return text.replace('%1', times[exp]);
    }, [storeConfigPix]);

    const onBillingAddressChangedError = useCallback(() => {
        resetShouldSubmit();
    }, [resetShouldSubmit]);

    const onBillingAddressChangedSuccess = useCallback(async () => {
        try {
            await updatePaymentMethod({
                variables: {
                    cartId,
                    payerName,
                    payerTaxId,
                    payerPhone
                }
            });
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
            addToast({
                type: 'error',
                message: formatMessage({
                    id: 'pagbank.genericError',
                    defaultMessage:
                        'Error processing payment. Please check payment information and try again.'
                }),
                timeout: 6000
            });
        }
    }, [updatePaymentMethod, cartId, payerName, payerTaxId, payerPhone]);

    useEffect(() => {
        if (onReady) {
            onReady();
        }
    }, [onReady]);

    useEffect(() => {
        const paymentMethodMutationCompleted =
            paymentMethodMutationCalled && !paymentMethodMutationLoading;

        if (
            paymentMethodMutationCompleted &&
            !paymentMethodMutationError &&
            onSuccess
        ) {
            onSuccess();
        }

        if (paymentMethodMutationError && onError) {
            onError();
        }
    }, [
        paymentMethodMutationError,
        paymentMethodMutationLoading,
        paymentMethodMutationCalled,
        onSuccess,
        onError,
        resetShouldSubmit
    ]);

    return {
        instruction,
        payerForm,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    };
};
