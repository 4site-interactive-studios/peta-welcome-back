import WelcomeBack from './lib/welcomeback';
import './main.scss';

// Make sure we only run after the page load, checking if the page is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new WelcomeBack());
} else {
  // Document is already loaded (interactive or complete)
  new WelcomeBack();
}
