import React, { useState } from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';

import defaultClasses from './pix.module.css';

const Pix = props => {
    const { paymentInfo } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const [copied, setCopied] = useState(false);

    if (!paymentInfo || paymentInfo === null) {
        return null;
    }

    if (paymentInfo.code !== 'pagbank_paymentmagento_pix') {
        return null;
    }

    const onCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={classes.root}>
            <span>
                <FormattedMessage
                    id={'pagBankPix.orderSuccessText'}
                    defaultMessage={'To pay, read the Qr Code'}
                />
            </span>
            <img
                className={classes.qrCodeImg}
                alt="qrcode image"
                src={paymentInfo.qr_code_image}
            />
            <span>
                <FormattedMessage
                    id={'pagBankPix.orderSuccessText2'}
                    defaultMessage={'Or if you prefer, copy and paste the code'}
                />
            </span>
            <div className={classes.qrCodeContainer}>
                <input
                    className={classes.qrCodeInput}
                    readOnly
                    value={paymentInfo.qr_code}
                />
                <CopyToClipboard text={paymentInfo.qr_code} onCopy={onCopy}>
                    <Button
                        classes={{
                            root_highPriority: classes.root_highPriority
                        }}
                        priority="high"
                    >
                        {copied ? (
                            <FormattedMessage
                                id={'pagBank.copied'}
                                defaultMessage={'Copied'}
                            />
                        ) : (
                            <FormattedMessage
                                id={'pagBank.copy'}
                                defaultMessage={'Copy'}
                            />
                        )}
                    </Button>
                </CopyToClipboard>
            </div>
        </div>
    );
};

Pix.propTypes = {
    classes: shape({
        root: string,
        qrCodeImg: string,
        qrCodeContainer: string,
        qrCodeInput: string,
        root_highPriority: string
    }),
    paymentInfo: shape({
        code: string.isRequired,
        qr_code_image: string.isRequired,
        qr_code: string.isRequired
    }).isRequired
};

Pix.defaultProps = {};
export default Pix;
