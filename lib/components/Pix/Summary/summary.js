import React from 'react';
import { func, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Edit2 as EditIcon } from 'react-feather';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';

import defaultClasses from './summary.module.css';
import { useSummary } from '../../../talon/Pix/Summary/useSummary';

const Summary = props => {
    const { onEdit } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useSummary();

    const { isLoading, selectedPaymentMethod, instruction } = talonProps;

    if (isLoading && !selectedPaymentMethod) {
        return (
            <LoadingIndicator classes={{ root: classes.loading }}>
                <FormattedMessage
                    id={'checkoutPage.loadingPaymentInformation'}
                    defaultMessage={'Fetching Payment Information'}
                />
            </LoadingIndicator>
        );
    }

    return (
        <div className={classes.root}>
            <div className={classes.heading_container}>
                <h5 className={classes.heading}>
                    <FormattedMessage
                        id={'checkoutPage.paymentInformation'}
                        defaultMessage={'Payment Information'}
                    />
                </h5>
                <LinkButton
                    className={classes.edit_button}
                    onClick={onEdit}
                    type="button"
                >
                    <Icon
                        size={16}
                        src={EditIcon}
                        classes={{ icon: classes.edit_icon }}
                    />
                    <span className={classes.edit_text}>
                        <FormattedMessage
                            id={'global.editButton'}
                            defaultMessage={'Edit'}
                        />
                    </span>
                </LinkButton>
            </div>
            <div className={classes.pix_details_container}>
                <span className={classes.payment_details}>
                    {selectedPaymentMethod.title}
                </span>

                {instruction && (
                    <div className={classes.instruction}>
                        <strong>
                            <FormattedMessage
                                id="pagBankPix.instruction"
                                defaultMessage={'Instruction'}
                            />
                        </strong>
                        <div
                            dangerouslySetInnerHTML={{ __html: instruction }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

Summary.propTypes = {
    classes: shape({
        root: string,
        heading_container: string,
        heading: string,
        edit_button: string,
        pix_details_container: string,
        payment_details: string
    }),
    onEdit: func.isRequired
};
Summary.defaultProps = {};
export default Summary;
