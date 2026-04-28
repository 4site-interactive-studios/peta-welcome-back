import PreferredPaymentMethod from './lib/preferred-payment-method';
import WelcomeBack from './lib/welcome-back';
import styles from './main.scss?inline';

// Inject the bundled stylesheet into the page so the JS file is self-contained
const injectStyles = () => {
  const STYLE_ID = 'peta-welcome-back-styles';
  if (document.getElementById(STYLE_ID)) return;
  const styleEl = document.createElement('style');
  styleEl.id = STYLE_ID;
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
};

const init = () => {
  injectStyles();
  new WelcomeBack();
  new PreferredPaymentMethod();
};

// Make sure we only run after the page load, checking if the page is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  // Document is already loaded (interactive or complete)
  init();
}
