import { gql } from '@apollo/client';

export const GET_STORE_CONFIG = gql`
    query storeConfigData {
        storeConfig {
            store_code
            pagbank_paymentmagento_pix_payer_name
            pagbank_paymentmagento_pix_payer_phone
            pagbank_paymentmagento_pix_payer_taxid
            pagbank_paymentmagento_pix_expiration
            pagbank_paymentmagento_pix_instruction_checkout
        }
    }
`;

export const SET_PAGBANK_PIX_PAYMENT = gql`
    mutation setPagBankPixPaymentMethod(
        $cartId: String!
        $payerName: String
        $payerTaxId: String
        $payerPhone: String
    ) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: {
                    code: "pagbank_paymentmagento_pix"
                    pagbank_paymentmagento_pix: {
                        payer_name: $payerName
                        payer_tax_id: $payerTaxId
                        payer_phone: $payerPhone
                    }
                }
            }
        ) @connection(key: "setPaymentMethodOnCart") {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;

export default {
    getStoreConfigQuery: GET_STORE_CONFIG,
    setPagBankPixPaymentMethodMutation: SET_PAGBANK_PIX_PAYMENT
};
