import { useQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './summary.gql';
import summaryOperations from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/summary.gql';
import { useIntl } from 'react-intl';
import { useMemo } from 'react';

/**
 * Retrieves summary data related to the PagBank pix payment method.
 * It includes payment details and the currently selected payment method, as well as a loading state.
 *
 * @returns {Object} An object containing loading status, selected payment method, and payment instructions.
 * @property {Object|null} selectedPaymentMethod - The selected payment method for the cart, or `null` if unavailable.
 * @property {boolean} isLoading - A flag indicating whether the data is still loading.
 * @property {string} instruction - Formatted instruction text based on store configuration.
 */
export const useSummary = (props = {}) => {
    const operations = mergeOperations(
        defaultOperations,
        summaryOperations,
        props.operations
    );
    const { getSummaryData, getStoreConfigQuery } = operations;

    const [{ cartId }] = useCartContext();
    const { formatMessage } = useIntl();

    const { data: summaryData, loading: summaryDataLoading } = useQuery(
        getSummaryData,
        {
            skip: !cartId,
            variables: { cartId }
        }
    );

    const { data: storeConfigPix } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const selectedPaymentMethod = summaryData
        ? summaryData.cart.selected_payment_method
        : null;

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

    return {
        isLoading: summaryDataLoading,
        selectedPaymentMethod,
        instruction
    };
};
