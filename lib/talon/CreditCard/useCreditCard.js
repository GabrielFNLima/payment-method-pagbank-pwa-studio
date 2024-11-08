import { useCallback, useEffect, useState, useMemo } from 'react';
import { useFormApi } from 'informed';
import {
    useQuery,
    useLazyQuery,
    useApolloClient,
    useMutation
} from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import PriceSummaryOperations from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummary.gql';
import { useIntl } from 'react-intl';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

import defaultOperations from './creditCard.gql';
import { useToasts } from '@magento/peregrine';
import usePayer from '../PayerForm/usePayer';
import { loadPagSeguroScript } from '../../util/loadPagSeguroScript';
import { detectCardType } from '../../util/detectCardType';

const cardInitialValues = {
    cc_number: '',
    cc_cvv: '',
    type: '',
    exp_month: '',
    exp_year: '',
    cc_holderName: '',
    installments: 0,
    creditCardBin: ''
};

/**
 * Talon to manage credit card payment information for PagBank in the Magento cart.
 *
 * @param {Object} props - Properties to configure the credit card handling.
 * @param {Function} props.onSuccess - Callback invoked upon successful payment method mutation.
 * @param {Function} props.onReady - Callback invoked when component is ready.
 * @param {Function} props.onError - Callback invoked on error during payment processing.
 * @param {boolean} props.shouldSubmit - Flag indicating if the form should submit.
 * @param {Function} props.resetShouldSubmit - Callback to reset the shouldSubmit flag.
 *
 * @returns {Object} An object containing handlers, states, and data for managing credit card payments.
 */
export const useCreditCard = props => {
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
        getListInstallmentsQuery,
        getPaymentMethodQuery,
        getInterestAppliedQuery,
        setPagBankCcPaymentMethodMutation,
        setPagBankCcInterestMutation
    } = operations;

    const [formState, setFormState] = useState(cardInitialValues);
    const [ccNumberToken, setCcNumberToken] = useState(null);

    const client = useApolloClient();
    const [{ cartId }] = useCartContext();
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const {
        payerTaxId,
        payerPhone,
        handlePayerTaxId,
        setPayerPhone: handlePayerPhone
    } = usePayer();

    const { data: storeConfigCc } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const [getAppliedInterest, { data: interestAppliedData }] = useLazyQuery(
        getInterestAppliedQuery,
        {
            fetchPolicy: 'no-cache',
            variables: {
                cartId
            }
        }
    );

    const {
        data: listInstallment,
        loading: isListInstallmentLoading
    } = useQuery(getListInstallmentsQuery, {
        fetchPolicy: 'network-only',
        variables: {
            cartId,
            creditCardBin: formState.cc_number.slice(0, 6)
        },
        skip: !formState.cc_number.trim()
    });

    const [
        updatePaymentMethod,
        {
            error: paymentMethodMutationError,
            called: paymentMethodMutationCalled,
            loading: paymentMethodMutationLoading
        }
    ] = useMutation(setPagBankCcPaymentMethodMutation);

    const [
        setPagBankCcInterest,
        { data: pagBankCcInsterestData }
    ] = useMutation(setPagBankCcInterestMutation, {
        onCompleted: () => {
            setTimeout(() => {
                client.refetchQueries({
                    include: [PriceSummaryOperations.getPriceSummaryQuery]
                });
            }, 1000);
        }
    });

    /**
     * Configures the payer form, providing handlers for capturing tax ID and phone.
     */
    const payerForm = useMemo(() => {
        return {
            hasTaxIdCapture: true,
            hasPhoneCapture:
                storeConfigCc?.storeConfig
                    ?.pagbank_paymentmagento_pix_payer_phone,
            handlePayerTaxId,
            handlePayerPhone
        };
    }, [storeConfigCc, handlePayerTaxId, handlePayerPhone]);

    const months = useMemo(() => {
        const months =
                storeConfigCc?.storeConfig
                    ?.pagbank_paymentmagento_cc_months_years?.months,
            sanitizedValue = months ? JSON.parse(months) : null;
        if (!sanitizedValue) {
            return [
                {
                    value: 0,
                    label: formatMessage({
                        id: 'pagbankCc.month',
                        defaultMessage: 'Month'
                    })
                }
            ];
        }
        const monthsObjs = Object.entries(sanitizedValue).map(
            ([key, value]) => {
                return {
                    value: key,
                    label: value
                };
            }
        );

        return [
            {
                value: 0,
                label: formatMessage({
                    id: 'pagbankCc.month',
                    defaultMessage: 'Month'
                })
            },
            ...monthsObjs
        ];
    }, [storeConfigCc]);

    const years = useMemo(() => {
        const years =
                storeConfigCc?.storeConfig
                    .pagbank_paymentmagento_cc_months_years?.years,
            sanitizedValue = years ? JSON.parse(years) : null;

        if (!sanitizedValue) {
            return [
                {
                    value: 0,
                    label: formatMessage({
                        id: 'pagbankCc.year',
                        defaultMessage: 'Year'
                    })
                }
            ];
        }

        const yearsObjs = Object.entries(sanitizedValue).map(([key, value]) => {
            return {
                value: key,
                label: value
            };
        });

        return [
            {
                value: 0,
                label: formatMessage({
                    id: 'pagbankCc.year',
                    defaultMessage: 'Year'
                })
            },
            ...yearsObjs
        ];
    }, [storeConfigCc]);

    const installments = useMemo(() => {
        console.log('formState', formState);
        if (!formState.cc_number || formState.cc_number.trim() === '') {
            return [
                {
                    value: 0,
                    label: formatMessage({
                        id: 'pagbankCc.enterCcNumber',
                        defaultMessage: 'Enter card number...'
                    })
                }
            ];
        }
        if (isListInstallmentLoading) {
            return [
                {
                    value: 0,
                    label: formatMessage({
                        id: 'pagbankCc.loadingInstallment',
                        defaultMessage: 'Loading Instalmment...'
                    })
                }
            ];
        }
        const installments = [
            {
                value: 0,
                label: formatMessage({
                    id: 'pagbankCc.selectInstallment',
                    defaultMessage: 'Select Instalmment'
                })
            }
        ];
        if (listInstallment?.pagBankListInstallments.length > 0) {
            listInstallment?.pagBankListInstallments.map(installment =>
                installments.push(installment)
            );
        }
        return installments;
    }, [formState, isListInstallmentLoading, listInstallment]);

    const availabeTypes = useMemo(() => {
        const types =
            storeConfigCc?.storeConfig
                ?.pagbank_paymentmagento_cc_types_available;

        return types ? types.split(',') : [];
    }, [storeConfigCc]);

    const onChangeInstallment = async installments => {
        const creditCardBin = formState.cc_number.slice(0, 6);

        if (installments > 0) {
            await setPagBankCcInterest({
                variables: {
                    cartId,
                    creditCardBin,
                    installmentSelected: Number(installments)
                }
            });
        }
    };

    /**
     * Fetches and sets the PagBank credit card payment details in the cache.
     */
    const setPaymentDetailsInCache = useCallback(
        ({ ccLast4, ccType }) => {
            client.writeQuery({
                query: getPaymentMethodQuery,
                data: {
                    cart: {
                        __typename: 'Cart',
                        id: cartId,
                        pagbank_paymentmagento_cc_details: {
                            ccLast4,
                            ccType
                        }
                    }
                }
            });
        },
        [cartId, client, getPaymentMethodQuery]
    );

    const handleFormChanges = useCallback(
        ({ target: { name, value } }) => {
            setFormState(previousState => {
                let newState = { ...previousState, [name]: value };

                if (name === 'cc_number') {
                    const cardType = detectCardType(value),
                        type = cardType ? cardType : null,
                        creditCardBin = value.slice(0, 6);
                    newState = { ...newState, type, creditCardBin };
                }

                if (name === 'installments') {
                    const installments = value;
                    onChangeInstallment(installments);
                    newState = { ...newState, installments };
                }
                return newState;
            });
        },
        [onChangeInstallment]
    );

    useEffect(() => {
        client.refetchQueries({
            include: [PriceSummaryOperations.getPriceSummaryQuery]
        });
    }, []);

    useEffect(async () => {
        if (
            storeConfigCc?.storeConfig?.pagbank_public_key &&
            formState.cc_number
        ) {
            let cardPs, cardTokenized;
            const cardData = {
                publicKey: storeConfigCc?.storeConfig?.pagbank_public_key,
                holder: formState.cc_holderName,
                number: formState.cc_number.replace(/s/g, ''),
                expMonth: formState.exp_month,
                expYear: formState.exp_year,
                securityCode: formState.cc_cvv
            };
            const PagSeguro = await loadPagSeguroScript();
            cardPs = PagSeguro.encryptCard(cardData);
            cardTokenized = cardPs.encryptedCard;
            setCcNumberToken(cardTokenized);
        }
    }, [storeConfigCc, formState]);

    const onBillingAddressChangedError = useCallback(() => {
        resetShouldSubmit();
    }, [resetShouldSubmit]);

    const onBillingAddressChangedSuccess = useCallback(async () => {
        try {
            if (ccNumberToken) {
                await updatePaymentMethod({
                    variables: {
                        cartId,
                        payerTaxId,
                        payerPhone,
                        ccToken: ccNumberToken,
                        installments: formState.installments,
                        ccTypeTransaction: 'CREDIT_CARD'
                    }
                });
                setPaymentDetailsInCache({
                    ccLast4: `**** **** **** ${formState.cc_number.slice(-4)}`,
                    ccType: formState?.type?.type
                });
            }
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
    }, [
        updatePaymentMethod,
        setPaymentDetailsInCache,
        cartId,
        payerTaxId,
        payerPhone,
        formState,
        ccNumberToken
    ]);

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

    const errors = useMemo(
        () =>
            new Map([
                [
                    'setPagBankCcPaymentMethodMutation',
                    paymentMethodMutationError
                ]
            ]),
        [paymentMethodMutationError]
    );

    return {
        payerForm,
        formState,
        months,
        years,
        installments,
        availabeTypes,
        disableInstallment:
            !formState.cc_number.trim() || isListInstallmentLoading,
        errors,
        handleFormChanges,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    };
};
