import { gql } from '@apollo/client';

export const GET_SUMMARY_DATA = gql`
    query getSummaryData($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            pagbank_paymentmagento_cc_details @client
            selected_payment_method {
                code
                title
            }
        }
    }
`;

export default {
    getPagBankCcSummaryData: GET_SUMMARY_DATA
};
