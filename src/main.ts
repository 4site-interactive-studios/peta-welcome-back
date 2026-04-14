import { RememberMe } from './lib/rememberme';
import './main.scss';

// Make sure we only run after the page load, checking if the page is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", RememberMe.init);
} else {
  // Document is already loaded (interactive or complete)
  RememberMe.init();
}
