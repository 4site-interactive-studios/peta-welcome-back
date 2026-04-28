/**
 * PreferredPaymentMethod - Manages the selection of a preferred payment method on PETA forms
 * Priority List:
 * 1. payment URL parameter
 * 2. PETA's remember-me cookie
 * 3. Default option array
 * Forces the payment URL parameter to be set if PETA's remember-me triggers after
 */
import { Logger } from "./logger";
import { elementExists, hideElement } from "./common";

interface PreferredPaymentMethodOptions {
  run: boolean;
  hide_change_paymenttype: boolean;
  payment_method_field_name: string;
  payment_method_selector: string;
  default_payment_method: string[];
}

const defaultConfig: PreferredPaymentMethodOptions = {
  run: true,
  hide_change_paymenttype: false,
  payment_method_field_name: 'transaction.paymenttype',
  payment_method_selector: '.peta_digital_wallet_payment_types',
  default_payment_method: ["VI"],
}

declare global {
  interface Window {
    PreferredPaymentMethodOptions?: Partial<PreferredPaymentMethodOptions>;
  }
}

export default class PreferredPaymentMethod {
  private overrideMethod: string | undefined;
  private config: PreferredPaymentMethodOptions;
  private logger = new Logger('WB-PreferredPaymentMethod');

  constructor() {
    this.config = { ...defaultConfig, ...window.PreferredPaymentMethodOptions };
    if (this.shouldRun() && this.config.run) {
      this.logger.log("Initializing PreferredPaymentMethod", "🎉");
      if (!this.checkForOverride()) {
        for (const method of this.config.default_payment_method) {
          if (this.selectPaymentMethod(method)) {
            this.logger.log("Default payment method selected: " + method, "🟢");
            break;
          }
        }
      }
      this.addListeners();
      if (this.config.hide_change_paymenttype) {
        hideElement('#clear-payment-data');
      }
    } else {
      this.logger.log("PreferredPaymentMethod will not run. Conditions not met.", "⚠️");
    }
  }

  private shouldRun(): boolean {
    return elementExists(this.config.payment_method_selector);
  }

  private checkForOverride(): boolean {
    // Check url params for 'payment'
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    if (payment && this.selectPaymentMethod(payment)) {
      this.logger.log("Override found in URL parameters: " + payment, "🟢");
      this.overrideMethod = payment;
      return true;
    } else {
      this.logger.log("No override set. Either no 'payment' parameter in URL or unavailable value.", "⚠️");
    }
    return false;
  }

  private addListeners(): void {
    document.addEventListener("autofillDefaultPaymentType", () => {
      this.logger.log('PETA script autofill default payment type event triggered', "ℹ️");
      if (this.overrideMethod) {
        this.logger.log('Overriding payment method back to ' + this.overrideMethod, "🟢");
        this.selectPaymentMethod(this.overrideMethod);
      }
    })
  }

  private selectPaymentMethod(method: string): boolean {
    const methodButton = document.querySelector(`input[name='${this.config.payment_method_field_name}'][value='${method}']`) as HTMLInputElement
    if (methodButton) {
      methodButton.click();
      this.logger.log('Payment method selected: ' + method, "ℹ️");
      return true;
    }
    return false;
  }

}