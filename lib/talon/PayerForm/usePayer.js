import { useState, useEffect, useCallback } from 'react';

/**
 * Talon to manage payer information for payments.
 * This includes handling and formatting the payer's tax ID.
 *
 * @param {Object} props - Optional properties to configure payer handling.
 *
 * @returns {Object} An object containing payer data and handlers.
 * @property {string|null} payerTaxId - Formatted tax ID of the payer, or `null` if not set.
 * @property {string|null} payerName - Name of the payer, or `null` if not set.
 * @property {string|null} payerPhone - Phone number of the payer, or `null` if not set.
 * @property {Function} handlePayerTaxId - Handler function to format and set the tax ID based on user input.
 * @property {Function} setPayerName - Setter function to update the payer's name.
 * @property {Function} setPayerPhone - Setter function to update the payer's phone number.
 */
const usePayer = props => {
    const [payerTaxId, setPayerTaxId] = useState(null);
    const [payerName, setPayerName] = useState(null);
    const [payerPhone, setPayerPhone] = useState(null);

    const handlePayerTaxId = useCallback(
        e => {
            let inputValue = e.target.value;

            const onlyNumbers = inputValue.replace(/\D/g, '');

            if (isNaN(Number(onlyNumbers)) || onlyNumbers === '') {
                setPayerTaxId(null);
                return;
            }

            if (onlyNumbers.length >= 12) {
                inputValue = onlyNumbers.replace(
                    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                    '$1.$2.$3/$4-$5'
                );
            } else {
                inputValue = onlyNumbers.replace(
                    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
                    '$1.$2.$3-$4'
                );
            }

            setPayerTaxId(inputValue);
        },
        [setPayerTaxId]
    );

    return {
        payerTaxId,
        payerName,
        payerPhone,
        handlePayerTaxId,
        setPayerName,
        setPayerPhone
    };
};

export default usePayer;
