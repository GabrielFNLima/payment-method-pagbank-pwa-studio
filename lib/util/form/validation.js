import { detectCardType } from '../detectCardType';

const SUCCESS = undefined;

export const validateEmail = value => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validate = regex.test(String(value).toLocaleLowerCase());

    if (validate === false) {
        const message = {
            id: 'validation.invalidEmailAddress',
            defaultMessage: 'Invalid email address'
        };
        return message;
    }

    return SUCCESS;
};

export const validateOnlyLetters = value => {
    const regex = /^[A-Za-z]+$/;
    const validate = regex.test(String(value));

    if (!validate) {
        const message = {
            id: 'validation.invalidOnlyLetters',
            defaultMessage: 'Input must contain only letters'
        };
        return message;
    }

    return SUCCESS;
};

export const validateCreditCard = value => {
    const sanitizedValue = value.replace(/[\s-]/g, '');
    const cardType = detectCardType(sanitizedValue);
    if (!cardType) {
        return {
            id: 'validation.invalidCreditCard',
            defaultMessage: 'Please enter a valid credit card type number.'
        };
    }

    if (!isValidLength(sanitizedValue, cardType.lengths)) {
        return {
            id: 'validation.invalidCardLength',
            defaultMessage: `Please enter a valid credit card type number.`
        };
    }

    if (!luhnCheck(sanitizedValue)) {
        console.log('cardType', cardType);
        return {
            id: 'validation.invalidCreditCard',
            defaultMessage: 'Please enter a valid credit card type number.'
        };
    }

    return SUCCESS;
};

export const validateCvv = value => {
    const minLenght = 3;
    if (!/^\d*$/.test(value)) {
        return {
            id: 'validation.creditCardCvv',
            defaultMessage:
                'Please enter a valid credit card verification number.'
        };
    }

    if (value.length < minLenght) {
        return {
            id: 'validation.creditCardCvv',
            defaultMessage:
                'Please enter a valid credit card verification number.'
        };
    }

    return SUCCESS;
};

export const validateSelect = value => {
    console.log('validateSelect', value);
    if (value === null || value === undefined || value === '') {
        return {
            id: 'validation.emptySelection',
            defaultMessage: 'Please select an option from the dropdown.'
        };
    }

    if (value === 0 || value === '0') {
        return {
            id: 'validation.invalidOption',
            defaultMessage:
                'The selected option is invalid. Please choose a different one.'
        };
    }

    return SUCCESS;
};

export const validateCpfCnpj = value => {
    const onlyNumbers = value.replace(/\D/g, '');

    if (onlyNumbers.length === 11) {
        return validateCPF(onlyNumbers);
    } else if (onlyNumbers.length === 14) {
        return validateCNPJ(onlyNumbers);
    }

    return {
        id: 'validation.invalidCpfCnpj',
        defaultMessage:
            'Invalid CPF or CNPJ. Please provide a valid CPF or CNPJ.'
    };
};

const validateCPF = cpf => {
    if (cpf.length !== 11) {
        return {
            id: 'validation.invalidCPF',
            defaultMessage: 'Invalid CPF. Please provide a valid CPF.'
        };
    }

    if (isCommonInvalidCPF(cpf)) {
        return {
            id: 'validation.invalidCPF',
            defaultMessage: 'Invalid CPF. Please provide a valid CPF.'
        };
    }

    let sum = 0;
    let remainder;

    // First verification digit
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i), 10) * (10 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9), 10)) {
        return {
            id: 'validation.invalidCPF',
            defaultMessage: 'Invalid CPF. Please provide a valid CPF.'
        };
    }

    // Second verification digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i), 10) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10), 10)) {
        return {
            id: 'validation.invalidCPF',
            defaultMessage: 'Invalid CPF. Please provide a valid CPF.'
        };
    }

    return SUCCESS;
};

const validateCNPJ = cnpj => {
    if (cnpj.length !== 14) {
        return {
            id: 'validation.invalidCNPJ',
            defaultMessage: 'Invalid CNPJ. Please provide a valid CNPJ.'
        };
    }

    if (isCommonInvalidCNPJ(cnpj)) {
        return {
            id: 'validation.invalidCNPJ',
            defaultMessage: 'Invalid CNPJ. Please provide a valid CNPJ.'
        };
    }

    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    // First verification digit
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i), 10) * pos--;
        if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0), 10)) {
        return {
            id: 'validation.invalidCNPJ',
            defaultMessage: 'Invalid CNPJ. Please provide a valid CNPJ.'
        };
    }

    // Second verification digit
    size += 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i), 10) * pos--;
        if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1), 10)) {
        return {
            id: 'validation.invalidCNPJ',
            defaultMessage: 'Invalid CNPJ. Please provide a valid CNPJ.'
        };
    }

    return SUCCESS;
};

// Helper functions for common invalid CPF and CNPJ numbers
const isCommonInvalidCPF = value => {
    const common = {
        '00000000000': true,
        '11111111111': true,
        '22222222222': true,
        '33333333333': true,
        '44444444444': true,
        '55555555555': true,
        '66666666666': true,
        '77777777777': true,
        '88888888888': true,
        '99999999999': true
    };
    return common.hasOwnProperty(value);
};

const isCommonInvalidCNPJ = value => {
    const common = {
        '00000000000000': true,
        '11111111111111': true,
        '22222222222222': true,
        '33333333333333': true,
        '44444444444444': true,
        '55555555555555': true,
        '66666666666666': true,
        '77777777777777': true,
        '88888888888888': true,
        '99999999999999': true
    };
    return common.hasOwnProperty(value);
};

// Helper function to validate card number length and luhn
const isValidLength = (number, validLengths) => {
    return validLengths.includes(number.length);
};

const luhnCheck = value => {
    let sum = 0;
    let alternate = false;

    for (let i = value.length - 1; i >= 0; i--) {
        let n = parseInt(value.charAt(i), 10);

        if (alternate) {
            n *= 2;
            if (n > 9) {
                n -= 9;
            }
        }

        sum += n;
        alternate = !alternate;
    }

    return sum % 10 === 0;
};
