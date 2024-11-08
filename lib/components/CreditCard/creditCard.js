import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Select from '@magento/venia-ui/lib/components/Select';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';

import defaultClasses from './creditCard.module.css';
import PayerForm from '../PayerForm/payerForm';
import CcTypes from './CcTypes/ccTypes';
import { Fieldset, Form, GroupField, Legend } from '../Form';
import { useCreditCard } from '../../talon/CreditCard/useCreditCard';
import {
    maskCreditCard,
    maskOnlyLetters,
    maskOnlyNumbers
} from '../../util/form/masks';
import {
    validateCreditCard,
    validateOnlyLetters,
    validateSelect
} from '../../util/form/validation';

const CreditCard = props => {
    const {
        classes: propClasses,
        onPaymentSuccess: onSuccess,
        onPaymentReady: onReady,
        onPaymentError: onError,
        resetShouldSubmit,
        shouldSubmit
    } = props;
    const classes = mergeClasses(defaultClasses, propClasses);

    const { formatMessage } = useIntl();

    const talonsProp = useCreditCard({
        onSuccess,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit
    });

    const {
        payerForm,
        formState,
        months,
        years,
        installments,
        availabeTypes,
        disableInstallment,
        errors,
        handleFormChanges,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = talonsProp;

    const ccTypeFilter = formState.type?.type ? (
        <CcTypes filterBy={formState.type.type} />
    ) : null;

    return (
        <div className={classes.root}>
            <PayerForm payerForm={payerForm} />
            <Form>
                <Legend>
                    <FormattedMessage
                        id={'pagBankCc.title'}
                        defaultMessage={'Card Information'}
                    />
                    <CcTypes availabeTypes={availabeTypes} />
                </Legend>
                <Fieldset>
                    <GroupField>
                        <Field
                            id="cc_number"
                            classes={{
                                label: classes.label,
                                root: classes.field
                            }}
                            label={formatMessage({
                                id: 'pagBankCc.ccNumberLabel',
                                defaultMessage: 'Credit Card Number'
                            })}
                        >
                            <TextInput
                                data-cy="PagBank-cc-number"
                                id="cc_number"
                                field="cc_number"
                                classes={{
                                    input: classes.input
                                }}
                                initialValue={formState.cc_number}
                                onChange={handleFormChanges}
                                after={ccTypeFilter}
                                mask={maskCreditCard}
                                validate={combine([
                                    isRequired,
                                    validateCreditCard
                                ])}
                            />
                        </Field>
                        <Field
                            id="cc_cvv"
                            classes={{
                                label: classes.label,
                                root: classes.field
                            }}
                            label={formatMessage({
                                id: 'pagBankCc.ccCvvLabel',
                                defaultMessage: 'CVV - Card Verification Number'
                            })}
                        >
                            <TextInput
                                data-cy="PagBank-cvv"
                                id="cc_cvv"
                                field="cc_cvv"
                                classes={{
                                    input: classes.input
                                }}
                                maxlength={formState?.type?.code?.size || 3}
                                initialValue={formState.cc_cvv}
                                onChange={handleFormChanges}
                                mask={maskOnlyNumbers}
                                validate={isRequired}
                            />
                        </Field>
                    </GroupField>
                    <GroupField>
                        <Field
                            id="exp_month"
                            classes={{
                                label: classes.label,
                                root: classes.field
                            }}
                            label={formatMessage({
                                id: 'pagBankCc.expMonthsLabel',
                                defaultMessage: 'Expiration Month'
                            })}
                        >
                            <Select
                                id="exp_month"
                                field="exp_month"
                                items={months}
                                initialValue={formState.exp_month}
                                classes={{
                                    input: classes.select
                                }}
                                onChange={handleFormChanges}
                                validate={combine([isRequired, validateSelect])}
                            />
                        </Field>
                        <Field
                            id="exp_year"
                            classes={{
                                label: classes.label,
                                root: classes.field
                            }}
                            label={formatMessage({
                                id: 'pagBankCc.expYearsLabel',
                                defaultMessage: 'Expiration Years'
                            })}
                        >
                            <Select
                                id="exp_year"
                                field="exp_year"
                                items={years}
                                initialValue={formState.exp_year}
                                classes={{
                                    input: classes.select
                                }}
                                onChange={handleFormChanges}
                                validate={combine([isRequired, validateSelect])}
                            />
                        </Field>
                    </GroupField>
                    <Field
                        id="cc_holderName"
                        classes={{
                            label: classes.label,
                            root: classes.field
                        }}
                        label={formatMessage({
                            id: 'pagBankCc.ccHolderNameLabel',
                            defaultMessage: 'Credit Card Holder Full Name'
                        })}
                    >
                        <TextInput
                            data-cy="PagBank-cc-holderName"
                            id="cc_holderName"
                            field="cc_holderName"
                            classes={{
                                input: classes.input
                            }}
                            initialValue={formState.cc_holderName}
                            onChange={handleFormChanges}
                            mask={maskOnlyLetters}
                            validate={combine([
                                isRequired,
                                validateOnlyLetters
                            ])}
                        />
                    </Field>
                    <Field
                        id="installments"
                        classes={{
                            label: classes.label,
                            root: classes.field
                        }}
                        label={formatMessage({
                            id: 'pagBankCc.installmentsLabel',
                            defaultMessage: 'Installments'
                        })}
                    >
                        <Select
                            id="installments"
                            field="installments"
                            items={installments}
                            initialValue={formState.installments}
                            classes={{
                                input: classes.select
                            }}
                            onChange={handleFormChanges}
                            validate={combine([isRequired, validateSelect])}
                            disabled={disableInstallment}
                        />
                    </Field>
                </Fieldset>
            </Form>
            <BillingAddress
                resetShouldSubmit={resetShouldSubmit}
                shouldSubmit={shouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

CreditCard.propTypes = {
    classes: shape({
        root: string
    }),
    onPaymentReady: func.isRequired,
    onPaymentSuccess: func.isRequired,
    onPaymentError: func.isRequired,
    resetShouldSubmit: func.isRequired,
    shouldSubmit: bool
};
CreditCard.defaultProps = {};
export default CreditCard;
