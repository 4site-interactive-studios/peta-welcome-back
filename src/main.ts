import PreferredPaymentMethod from './lib/preferred-payment-method';
import WelcomeBack from './lib/welcome-back';
import './main.scss';

// Make sure we only run after the page load, checking if the page is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new WelcomeBack();
    new PreferredPaymentMethod();
  });
} else {
  // Document is already loaded (interactive or complete)
  new WelcomeBack();
  new PreferredPaymentMethod();
}
