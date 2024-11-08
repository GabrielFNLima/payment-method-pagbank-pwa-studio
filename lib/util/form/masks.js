import { detectCardType } from '../detectCardType';

export const maskCreditCard = (value, type) => {
    if (!value) return '';

    let sanitizedValue = value.replace(/[^\d]/g, '');

    const cardType = detectCardType(value);

    if (!cardType) return sanitizedValue;

    const maxLength = cardType.lengths[0];
    sanitizedValue = sanitizedValue.substring(0, cardType.lengths[0]);

    let maskedValue = '';
    let currentPosition = 0;

    cardType.gaps.forEach(gap => {
        if (currentPosition < sanitizedValue.length) {
            maskedValue += sanitizedValue.substring(currentPosition, gap) + ' ';
            currentPosition = gap;
        }
    });

    maskedValue += sanitizedValue.substring(currentPosition);

    return maskedValue.trim();
};

export const maskOnlyLetters = value => {
    if (!value) return '';
    return value
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
        .replace(/[0-9]/g, '');
};

export const maskOnlyNumbers = value => {
    if (!value) return '';
    return value.replace(/\D/g, '');
};

export const maskCpfCnpj = value => {
    if (!value) return '';

    const onlyNumbers = value.replace(/\D/g, '');

    if (isNaN(Number(onlyNumbers)) || onlyNumbers === '') {
        return null;
    }

    if (onlyNumbers.length >= 12) {
        return onlyNumbers.replace(
            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
            '$1.$2.$3/$4-$5'
        );
    } else {
        return onlyNumbers.replace(
            /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
            '$1.$2.$3-$4'
        );
    }
};

export const maskPhone = value => {
    if (!value) return '';

    const onlyNumbers = value.replace(/\D/g, '');

    if (onlyNumbers.length <= 10) {
        return onlyNumbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else if (onlyNumbers.length === 11) {
        return onlyNumbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }

    return onlyNumbers;
};
