import React from 'react';
import { string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './orderConfirmation.module.css';
import useOrderConfirmation from '../../talon/OrderConfirmation/useOrderConfirmation';
import Pix from './Pix';

const OrderConfirmation = props => {
    const { orderNumber } = props;

    const talonProps = useOrderConfirmation({
        orderNumber
    });

    const { isLoading, paymentInfo } = talonProps;

    if (!paymentInfo || isLoading) {
        return null;
    }

    return (
        <>
            <Pix paymentInfo={paymentInfo?.pagbank_paymentmagento_pix} />
        </>
    );
};

OrderConfirmation.propTypes = {
    orderNumber: string
};
OrderConfirmation.defaultProps = {};
export default OrderConfirmation;
