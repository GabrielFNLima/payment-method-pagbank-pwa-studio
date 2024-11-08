import { gql } from '@apollo/client';

export const PagBankInterstFragment = gql`
    fragment PagBankInterstFragment on Cart {
        id
        pagbank_interest_amount {
            value
            currency
        }
    }
`;
