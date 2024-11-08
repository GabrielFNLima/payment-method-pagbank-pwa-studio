import {
    useQuery,
    useApolloClient,
    useMutation,
    ApolloLink,
    InMemoryCache,
    HttpLink
} from '@apollo/client';
import PriceSummaryOperations from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummary.gql';
import PaymentMethodOperations from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/paymentMethods.gql';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useCallback } from 'react';

const wrapUsePaymentMethods = original => {
    return function usePaymentMethods(props, ...restArgs) {
        const client = useApolloClient();
        const [{ cartId }] = useCartContext();

        const [setPaymentMethod] = useMutation(
            PaymentMethodOperations.setPaymentMethodOnCartMutation,
            {
                onCompleted: () => {
                    setTimeout(() => {
                        client.refetchQueries({
                            include: [
                                PriceSummaryOperations.getPriceSummaryQuery
                            ]
                        });
                    }, 1000);
                }
            }
        );
        const { ...defaultReturnData } = original(props, ...restArgs);

        const handlePaymentMethodSelection = useCallback(
            element => {
                const value = element.target.value;

                const paymentMethodData =
                    value == 'braintree'
                        ? {
                              code: value,
                              braintree: {
                                  payment_method_nonce: value,
                                  is_active_payment_token_enabler: false
                              }
                          }
                        : {
                              code: value
                          };

                setPaymentMethod({
                    variables: {
                        cartId,
                        paymentMethod: paymentMethodData
                    }
                });
            },
            [cartId, setPaymentMethod]
        );

        return {
            ...defaultReturnData,
            handlePaymentMethodSelection
        };
    };
};

export default wrapUsePaymentMethods;
