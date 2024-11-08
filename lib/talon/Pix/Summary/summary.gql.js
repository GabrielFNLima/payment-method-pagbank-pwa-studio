import { gql } from '@apollo/client';

export const GET_STORE_CONFIG = gql`
    query storeConfigData {
        storeConfig {
            store_code
            pagbank_paymentmagento_pix_expiration
            pagbank_paymentmagento_pix_instruction_checkout
        }
    }
`;

export default {
    getStoreConfigQuery: GET_STORE_CONFIG
};
