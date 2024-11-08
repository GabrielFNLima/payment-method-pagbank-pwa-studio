import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import defaultClasses from './payerForm.module.css';
import { validateCpfCnpj } from '../../util/form/validation';
import { maskCpfCnpj, maskPhone } from '../../util/form/masks';
import { Fieldset, Form, Legend } from '../Form';

const PayerForm = props => {
    const { payerForm } = props;

    if (!payerForm) {
        return null;
    }

    const {
        hasTaxIdCapture,
        hasNameCapture,
        hasPhoneCapture,
        handlePayerTaxId,
        handlePayerPhone,
        handlePayerName
    } = payerForm;
    const classes = mergeClasses(defaultClasses, props.classes);

    const { formatMessage } = useIntl();
    return (
        <Form>
            <Legend>
                <FormattedMessage
                    id={'pagBankPayer.title'}
                    defaultMessage={'Payer Information'}
                />
            </Legend>
            <Fieldset>
                {hasTaxIdCapture && (
                    <Field
                        id="payerTaxId"
                        classes={{
                            label: classes.label,
                            root: classes.field
                        }}
                        label={formatMessage({
                            id: 'pagBankPayer.payerTaxIdLabel',
                            defaultMessage: 'Payer Tax id'
                        })}
                    >
                        <TextInput
                            data-cy="PagBank-payer-taxid"
                            id="payerTaxId"
                            field="payerTaxId"
                            classes={{
                                input: classes.input
                            }}
                            initialValue={''}
                            onChange={handlePayerTaxId}
                            mask={maskCpfCnpj}
                            validate={combine([isRequired, validateCpfCnpj])}
                        />
                    </Field>
                )}
                {hasPhoneCapture && (
                    <Field
                        id="payerPhone"
                        classes={{
                            label: classes.label,
                            root: classes.field
                        }}
                        label={formatMessage({
                            id: 'pagBankPayer.payerPhoneLabel',
                            defaultMessage: 'Payer Phone'
                        })}
                    >
                        <TextInput
                            data-cy="PagBank-payer-phone"
                            id="payerPhone"
                            field="payerPhone"
                            classes={{
                                input: classes.input
                            }}
                            initialValue={''}
                            onChange={e => handlePayerPhone(e.target.value)}
                            validate={isRequired}
                            mask={maskPhone}
                        />
                    </Field>
                )}
                {hasNameCapture && (
                    <Field
                        id="payerName"
                        classes={{
                            label: classes.label,
                            root: classes.field
                        }}
                        label={formatMessage({
                            id: 'pagBankPayer.payerNameLabel',
                            defaultMessage: 'Payer Full Name'
                        })}
                    >
                        <TextInput
                            data-cy="PagBank-payer-name"
                            id="payerName"
                            field="payerName"
                            classes={{
                                input: classes.input
                            }}
                            initialValue={''}
                            onChange={e => handlePayerName(e.target.value)}
                            validate={isRequired}
                        />
                    </Field>
                )}
            </Fieldset>
        </Form>
    );
};

PayerForm.propTypes = {
    classes: shape({
        root: string,
        label: string,
        field: string,
        input: string
    }),
    payerForm: shape({
        hasTaxIdCapture: bool,
        hasNameCapture: bool,
        hasPhoneCapture: bool,
        handlePayerTaxId: func,
        handlePayerPhone: func,
        handlePayerName: func
    })
};
PayerForm.defaultProps = {};
export default PayerForm;
