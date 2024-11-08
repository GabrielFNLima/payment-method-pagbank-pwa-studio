import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { bool, func, shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';

import defaultClasses from './pix.module.css';
import { usePix } from '../../talon/Pix/usePix';
import PayerForm from '../PayerForm/payerForm';

const Pix = props => {
    const {
        classes: propClasses,
        onPaymentSuccess: onSuccess,
        onPaymentReady: onReady,
        onPaymentError: onError,
        resetShouldSubmit,
        shouldSubmit
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = usePix({
        onSuccess,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit
    });

    const {
        instruction,
        payerForm,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = talonProps;

    return (
        <div className={classes.root}>
            <PayerForm payerForm={payerForm} />
            {instruction && (
                <div className={classes.instruction}>
                    <strong>
                        <FormattedMessage
                            id="pagBankPix.instruction"
                            defaultMessage={'Instruction'}
                        />
                    </strong>
                    <div dangerouslySetInnerHTML={{ __html: instruction }} />
                </div>
            )}

            <BillingAddress
                resetShouldSubmit={resetShouldSubmit}
                shouldSubmit={shouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

Pix.propTypes = {
    classes: shape({ root: string }),
    onPaymentReady: func.isRequired,
    onPaymentSuccess: func.isRequired,
    onPaymentError: func.isRequired,
    resetShouldSubmit: func.isRequired,
    shouldSubmit: bool
};
Pix.defaultProps = {};
export default Pix;
