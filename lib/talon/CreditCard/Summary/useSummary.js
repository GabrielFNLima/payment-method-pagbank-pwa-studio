import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useQuery } from '@apollo/client';

import defaultOperations from './summary.gql';

/**
 * Retrieves summary data related to the PagBank credit card payment method.
 * It includes payment details and the currently selected payment method, as well as a loading state.
 *
 * @function useSummary
 * @returns {Object} An object containing payment details, selected payment method, and loading state.
 * @property {Object|null} paymentDetails - The details of the PagBank credit card payment for the cart, or `null` if unavailable.
 * @property {Object|null} selectedPaymentMethod - The selected payment method for the cart, or `null` if unavailable.
 * @property {boolean} isLoading - A flag indicating whether the data is still loading.
 */
const useSummary = () => {
    const operations = mergeOperations(defaultOperations);
    const { getPagBankCcSummaryData } = operations;

    const [{ cartId }] = useCartContext();
    const { data: summaryData, loading: isLoading } = useQuery(
        getPagBankCcSummaryData,
        {
            skip: !cartId,
            variables: { cartId }
        }
    );

    const paymentDetails = summaryData
        ? summaryData.cart.pagbank_paymentmagento_cc_details
        : null;

    const selectedPaymentMethod = summaryData
        ? summaryData.cart.selected_payment_method
        : null;

    return {
        paymentDetails,
        selectedPaymentMethod,
        isLoading
    };
};

export default useSummary;
