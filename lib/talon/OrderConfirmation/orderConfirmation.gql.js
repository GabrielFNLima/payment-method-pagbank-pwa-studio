import { gql } from '@apollo/client';

const PagBankPixOrderSuccessFragment = gql`
    fragment PagBankPixOrderSuccessFragment on PagBankPixOrderSuccessOutput {
        code
        title
        qr_code
        qr_code_image
        expiration_date
        payer_name
        payer_tax_id
    }
`;

const GET_PAYMENT_INFORMATION = gql`
    query getPagBankPaymentInfo($orderNumber: String!) {
        pagBankOrderSuccess(input: { orderId: $orderNumber }) {
            pagbank_paymentmagento_pix {
                ...PagBankPixOrderSuccessFragment
            }
        }
    }

    ${PagBankPixOrderSuccessFragment}
`;

export default {
    getPagBankPaymentInfoQuery: GET_PAYMENT_INFORMATION
};
