import React from 'react';
import { FormattedMessage } from 'react-intl';
import { object, shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './interest.module.css';

const Interest = props => {
    const { flatData } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    if (flatData.pagbank_interest_amount.value <= 0) {
        return null;
    }

    return (
        <div className={classes.root}>
            <span className={classes.lineItemLabel}>
                <FormattedMessage
                    id={'pagBankInterest.label'}
                    defaultMessage={'Interest'}
                />
            </span>
            <span className={classes.price}>
                <Price
                    value={parseFloat(flatData.pagbank_interest_amount.value)}
                    currencyCode={flatData.pagbank_interest_amount.currency}
                />
            </span>
        </div>
    );
};

Interest.propTypes = {
    classes: shape({
        root: string,
        lineItemLabel: string,
        price: string
    }),
    flatData: object.isRequired
};
Interest.defaultProps = {};
export default Interest;
