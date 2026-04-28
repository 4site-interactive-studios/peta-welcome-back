# PETA Welcome Back

Standalone implementation of ENgrid's [Remember Me](https://engrid.4sitestudios.com/docs/v2/remember-me) / [Welcome Back](https://engrid.4sitestudios.com/docs/v2/welcome-back) functionality, and [Preferred Payment Method](https://engrid.4sitestudios.com/docs/v2/preferred-payment-method) functionality.

This implementation is tailored specifically for PETA's use case, with custom handling for clearing auto-filled supporter details and displaying a "Welcome Back" block when supporter information is detected on the page. It leverages PETA's existing remember-me functions and events to detect when supporter data has been auto-filled or cleared, and hooks into those events to show or hide the "Welcome Back" block accordingly.

## Configuration

### Welcome Back

The behavior of the Welcome Back functionality can be customized via the global `window.WelcomeBackOptions` object, which merges with the default configuration defined in `welcome-back.ts`. The available configuration options are:

| Option | Description | Default |
|--------|-------------|---------|
| `language` | Localization for Welcome Back text (ES or EN), unset will automatically detect based on hostname | unset |
| `location_selector` | CSS selector for the element after which the Welcome Back block should be inserted | `'.en__field--emailAddress'` |
| `hide_clear_autofill` | Whether to hide the "Clear Autofill" button when the Welcome Back block is shown | `true` |
| `hide_change_paymenttype` | Whether to hide the "Change Payment Type" button when the Welcome Back block is shown | `false` |
| `conditional_hide_selectors` | CSS selector for the element that should be conditionally hidden when the Welcome Back block is shown | See below |
| `run` | Whether the Welcome Back functionality should run | `true` |


#### Default conditional hide selectors

1. `.expressCheckout_label` - "Billing Address" heading
2. `.en__field--NOT_TAGGED_69` - Mobile phone (PETA) input
3. `.en__field--emailAddress` - Email address input
4. `.en__field--country` - Country input
5. `.en__field--firstName` - First name input
6. `.en__field--lastName` - Last name input
7. `.en__field--address1` - Address1 input
8. `.en__field--address2` - Address2 input
9. `.en__field--city` - City input
10. `.en__field--region` - Region/State input
11. `.en__field--postcode` - Postal Code input


### Preferred Payment Method

The behavior of the Preferred Payment Method functionality can be customized via the global `window.PreferredPaymentMethodOptions` object, which merges with the default configuration defined in `preferred-payment-method.ts`. The available configuration options are:

| Option | Description | Default |
|--------|-------------|---------|
| `run` | Whether the Preferred Payment Method functionality should run | `true` |
| `hide_change_paymenttype` | Whether to hide the "Change Payment Type" button when the Preferred Payment Method block is shown | `false` |
| `payment_method_field_name` | The name attribute of the payment method input field | `'transaction.paymenttype'` |
| `payment_method_selector` | CSS selector for the payment method container | `'.peta_digital_wallet_payment_types'` |
| `default_payment_method` | Array of default payment methods to select | `["VI"]` (card) |

PETA uses the following formats for payment methods:
1. `VI` - Cards
2. `paypal` - PayPal
3. `EC` - ACH/Bank Transfer

Digital Wallets, when available, are presented as "Express Checkout" and do not use the payment type selector.

## Implementation

To implement the Welcome Back & Preferred Payment Method functionality on your EN pages:
- Generate the compiled code using `npm run build:prod`
- Upload the compiled JavaScript and CSS files to your EN assets
- Include the uploaded JavaScript and CSS files in your template. The CSS can be included in the `<head>` of your template as usual. The JavaScript file should be included after all remember-me related scripts, likely near the end of your `<body>`. 
    - `peta-remember-me.js`
    - `peta-en-field-populator.js`
    - `peta-cross-domain.js`

## Development Instructions

Clone this repository and install the dependencies:
```bash
npm install
```

To build the project for development:
```bash
npm run build:dev
```

To build the project for production:
```bash
npm run build:prod
```

The majority of the implementation is located in `src/lib/welcome-back.ts` and `src/lib/preferred-payment-method.ts`.
