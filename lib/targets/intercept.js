const { Targetables } = require('@magento/pwa-buildpack');

const componentOverrideMapping = require('./componentOverrideMapping');
const moduleOverridePlugin = require('./moduleOverrideWebpackPlugin');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
        flags[targets.name] = {
            cssModules: true,
            esModules: true,
            graphqlQueries: true,
            i18n: true
        };
    });

    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new moduleOverridePlugin(componentOverrideMapping).apply(compiler);
    });

    const {
        checkoutPagePaymentTypes,
        editablePaymentTypes,
        summaryPagePaymentTypes
    } = targets.of('@magento/venia-ui');

    const paymentsSuported = [
        {
            paymentCode: 'pagbank_paymentmagento_pix',
            importPaths: {
                payment:
                    '@devgfnl/payment-method-pagbank-pwa-studio/lib/components/Pix',
                edit:
                    '@devgfnl/payment-method-pagbank-pwa-studio/lib/components/Pix/Edit',
                summary:
                    '@devgfnl/payment-method-pagbank-pwa-studio/lib/components/Pix/Summary'
            }
        },
        {
            paymentCode: 'pagbank_paymentmagento_cc',
            importPaths: {
                payment:
                    '@devgfnl/payment-method-pagbank-pwa-studio/lib/components/CreditCard',
                edit:
                    '@devgfnl/payment-method-pagbank-pwa-studio/lib/components/CreditCard/Edit',
                summary:
                    '@devgfnl/payment-method-pagbank-pwa-studio/lib/components/CreditCard/Summary'
            }
        }
    ];

    paymentsSuported.forEach(payment => {
        checkoutPagePaymentTypes.tap(payments =>
            payments.add({
                paymentCode: payment.paymentCode,
                importPath: payment.importPaths.payment
            })
        );

        editablePaymentTypes.tap(editablePaymentTypes =>
            editablePaymentTypes.add({
                paymentCode: payment.paymentCode,
                importPath: payment.importPaths.edit
            })
        );

        summaryPagePaymentTypes.tap(paymentSummaries =>
            paymentSummaries.add({
                paymentCode: payment.paymentCode,
                importPath: payment.importPaths.summary
            })
        );
    });

    // Payment Information after success order
    const OrderConfirmationPage = targetables.reactComponent(
        '@magento/venia-ui/lib/components/CheckoutPage/OrderConfirmationPage/orderConfirmationPage.js'
    );

    const PaymentConfrimation = OrderConfirmationPage.addImport(
        "OrderConfirmation from '@devgfnl/payment-method-pagbank-pwa-studio/lib/components/OrderConfirmation'"
    );

    OrderConfirmationPage.insertAfterJSX(
        '<div className={classes.shippingMethod}>',
        `<${PaymentConfrimation} orderNumber={orderNumber} />`
    );

    // Payment Title
    const PaymentMethods = targetables.reactComponent(
        '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethods.js'
    );

    const PaymentMethodTitle = PaymentMethods.addImport(
        "PaymentMethodTitle from '@devgfnl/payment-method-pagbank-pwa-studio/lib/components/CheckoutPage/PaymentInformation/PaymentMethodTitle/paymentMethodTitle'"
    );

    PaymentMethods.setJSXProps('Radio', {
        label: `<${PaymentMethodTitle} code={code} title={title} />`
    });

    const peregrineTargets = targets.of('@magento/peregrine');
    const talonsTarget = peregrineTargets.talons;

    talonsTarget.tap(talonWrapperConfig => {
        talonWrapperConfig.CheckoutPage.PaymentInformation.usePaymentMethods.wrapWith(
            targets.name + '/lib/targets/wrapUsePaymentMethods.js'
        );
    });

    // Price Summary Component
    const PriceSummary = targetables.reactComponent(
        '@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.js'
    );
    const Interest = PriceSummary.addImport(
        "Interest from '@devgfnl/payment-method-pagbank-pwa-studio/lib/components/Interest'"
    );

    PriceSummary.insertBeforeSource(
        '<DiscountSummary',
        `<${Interest} flatData={flatData} classes={{ root: classes.lineItems, lineItemLabel: classes.lineItemLabel, price: priceClass }} />`
    );

    const usePriceSummary = targetables.esModule(
        '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary.js'
    );

    usePriceSummary.insertAfterSource(
        'shipping: data.cart.shipping_addresses',
        ', pagbank_interest_amount: data.cart.pagbank_interest_amount'
    );

    // Price Summary Graphql
    const priceSummary = targetables.esModule(
        '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummary.gql.js'
    );

    priceSummary.addImport(
        'import {PagBankInterstFragment} from "@devgfnl/payment-method-pagbank-pwa-studio/lib/talon/CreditCard/pagBankInterestFragment.gql";'
    );

    priceSummary
        .insertAfterSource(
            '...PriceSummaryFragment',
            ' ...PagBankInterstFragment'
        )
        .insertAfterSource(
            '${PriceSummaryFragment}',
            ' ${PagBankInterstFragment}'
        );
};
