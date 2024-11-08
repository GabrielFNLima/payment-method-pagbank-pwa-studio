import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './edit.module.css';
import Pix from '../pix';

const Edit = props => {
    const {
        onPaymentReady,
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit,
        shouldSubmit
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <div className={classes.root}>
            <Pix
                onPaymentReady={onPaymentReady}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                resetShouldSubmit={resetShouldSubmit}
                shouldSubmit={shouldSubmit}
            />
        </div>
    );
};

Edit.propTypes = {
    classes: shape({ root: string }),
    onPaymentReady: func.isRequired,
    onPaymentSuccess: func.isRequired,
    onPaymentError: func.isRequired,
    resetShouldSubmit: func.isRequired,
    shouldSubmit: bool
};
Edit.defaultProps = {};
export default Edit;
