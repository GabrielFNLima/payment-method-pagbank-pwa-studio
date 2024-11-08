import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './orderConfirmation.gql';

/**
 * Talon to retrieve and manage PagBank payment information for success page.
 *
 * @param {Object} props - Properties to configure the order confirmation handling.
 * @param {string} props.orderNumber - The order number to fetch payment information for.
 * @param {Object} [props.operations] - Optional custom GraphQL operations to override defaults.
 *
 * @returns {Object} An object containing the loading state and payment information.
 * @property {boolean} isLoading - Indicates if the payment information is still loading.
 * @property {Object|null} paymentInfo - Payment information for the given order, or `null` if not available.
 */
const useOrderConfirmation = props => {
    const { orderNumber } = props;

    const operations = mergeOperations(defaultOperations, props.operations);

    const { getPagBankPaymentInfoQuery } = operations;

    const { data: paymentInfoData, loading: isLoading, error } = useQuery(
        getPagBankPaymentInfoQuery,
        {
            variables: { orderNumber },
            fetchPolicy: 'cache-and-network'
        }
    );

    const paymentInfo = useMemo(() => {
        return paymentInfoData?.pagBankOrderSuccess;
    }, [paymentInfoData]);

    return {
        isLoading,
        paymentInfo
    };
};

export default useOrderConfirmation;
