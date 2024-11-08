import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';

import defaultClasses from './paymentMethodTitle.module.css';

const PAYMENT_ICONS = {
    pagbank_paymentmagento_pix: (
        <svg
            viewBox="72 0.5 59 39"
            width={59}
            height={39}
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x={72.543}
                y={0.982}
                width={57.915}
                height={38.036}
                rx={3.5}
                fill="#f4f7f9"
                stroke="#D4D4D4"
            />
            <path
                d="M107.382 25.565a3.069 3.069 0 01-2.182-.903l-3.151-3.15a.599.599 0 00-.828 0l-3.162 3.161a3.069 3.069 0 01-2.182.903h-.621l3.991 3.99a3.193 3.193 0 004.513 0l4.002-4.001h-.38zM95.877 14.424c.824 0 1.599.32 2.182.903l3.162 3.162c.228.227.6.228.828-.001l3.151-3.15a3.069 3.069 0 012.182-.903h.38l-4.002-4.001a3.195 3.195 0 00-4.514 0l-3.99 3.99h.621z"
                fill="#32BCAD"
            />
            <path
                d="M111.072 17.744c-1.228-1.111-2.529-2.383-2.59-2.383h-1.099c-.569 0-1.125.231-1.527.633l-3.151 3.149a1.508 1.508 0 01-1.069.443c-.388 0-.775-.148-1.069-.442l-3.163-3.162a2.173 2.173 0 00-1.527-.632h-1.352c-.057 0-2.59 2.394-2.59 2.394a3.189 3.189 0 000 4.512s2.533 2.394 2.59 2.394h1.352c.569 0 1.125-.23 1.527-.632l3.162-3.161c.572-.571 1.568-.571 2.139 0l3.151 3.15c.402.401.958.632 1.527.632h1.099c.061 0 2.59-2.383 2.59-2.383 1.247-1.246 1.228-3.401 0-4.512z"
                fill="#32BCAD"
            />
        </svg>
    ),
    pagbank_paymentmagento_cc: (
        <svg
            viewBox="72 0.5 59 39"
            width={59}
            height={39}
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x={72.543}
                y={0.982}
                width={57.915}
                height={38.036}
                rx={3.5}
                fill="#f4f7f9"
                stroke="#D4D4D4"
            />
            <g
                transform="matrix(1.4979 0 0 1.4979 86.521 3.837) translate(0 3)"
                fill="#434343"
                fillRule="nonzero"
                strokeWidth=".667602px"
                stroke="#434343"
            >
                <path
                    d="M17.917 0H2.083A2.117 2.117 0 000 2.1v10.085a2.117 2.117 0 002.083 2.1h15.834a2.117 2.117 0 002.083-2.1V2.1A2.117 2.117 0 0017.917 0zM2.083.84h15.834c.685.012 1.239.57 1.25 1.26v2.102H.833V2.1A1.276 1.276 0 012.083.84zm15.834 12.605H2.083a1.276 1.276 0 01-1.25-1.26V5.042h18.334v7.143a1.276 1.276 0 01-1.25 1.26z"
                    vectorEffect="non-scaling-stroke"
                />
                <path
                    vectorEffect="non-scaling-stroke"
                    d="M2.5 7.56302521L6.66666667 7.56302521 6.66666667 8.40336134 2.5 8.40336134z"
                />
            </g>
        </svg>
    )
};

const SUPPORTED_PAYMENTS = {
    pagbank_paymentmagento_pix: true,
    pagbank_paymentmagento_cc: true
};

const PaymentMethodTitle = ({ code, title, ...props }) => {
    const classes = mergeClasses(defaultClasses, props.classes);
    if (!SUPPORTED_PAYMENTS[code]) return title;

    return (
        <div className={classes.root}>
            {PAYMENT_ICONS[code]}
            {title}
        </div>
    );
};

PaymentMethodTitle.propTypes = {
    classes: shape({ root: string }),
    code: string.isRequired,
    title: string.isRequired
};
PaymentMethodTitle.defaultProps = {};
export default PaymentMethodTitle;
