import { gql } from '@apollo/client';
import { PagBankInterstFragment } from './pagBankInterestFragment.gql';

export const GET_INTEREST_APPLIED = gql`
    query getAppliedInterest($cartId: String!) {
        cart(cart_id: $cartId) {
            ...PagBankInterstFragment
        }
    }
    ${PagBankInterstFragment}
`;

export const GET_PAYMENT_DETAILS = gql`
    query getPaymentMethod($cartId: String!) {
        cart(cart_id: $cartId) @client {
            id
            pagbank_paymentmagento_cc_details
        }
    }
`;

export const GET_LIST_INSTALLMENTS = gql`
    query getListInstallments($cartId: String!, $creditCardBin: String!) {
        pagBankListInstallments(
            cart_id: $cartId
            credit_card_bin: $creditCardBin
        ) {
            label
            value
        }
    }
`;

export const GET_STORE_CONFIG = gql`
    query storeConfigData {
        storeConfig {
            store_code
            pagbank_paymentmagento_cc_payer_phone
            pagbank_paymentmagento_cc_payer_taxid
            pagbank_paymentmagento_cc_max_installment
            pagbank_paymentmagento_cc_types_available
            pagbank_paymentmagento_cc_months_years {
                months
                years
            }
            pagbank_public_key
        }
    }
`;

export const SET_PAGBANK_CC_PAYMENT = gql`
    mutation setPagBankCcPaymentMethod(
        $cartId: String!
        $payerTaxId: String
        $payerPhone: String
        $ccToken: String!
        $installments: String
        $ccTypeTransaction: String
    ) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: {
                    code: "pagbank_paymentmagento_cc"
                    pagbank_paymentmagento_cc: {
                        cc_number_token: $ccToken
                        cc_installments: $installments
                        card_type_transaction: $ccTypeTransaction
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

export const SET_PAGBANK_CC_SET_INTEREST = gql`
    mutation setPagBankCcInterest(
        $cartId: String!
        $creditCardBin: String!
        $installmentSelected: Int!
    ) {
        pagBankCcApplyInstallments(
            cart_id: $cartId
            credit_card_bin: $creditCardBin
            installment_selected: $installmentSelected
        )
    }
`;

export default {
    getPaymentMethodQuery: GET_PAYMENT_DETAILS,
    getStoreConfigQuery: GET_STORE_CONFIG,
    getInterestAppliedQuery: GET_INTEREST_APPLIED,
    getListInstallmentsQuery: GET_LIST_INSTALLMENTS,
    setPagBankCcPaymentMethodMutation: SET_PAGBANK_CC_PAYMENT,
    setPagBankCcInterestMutation: SET_PAGBANK_CC_SET_INTEREST
};
