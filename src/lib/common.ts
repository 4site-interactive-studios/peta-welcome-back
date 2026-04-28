/**
 * Checks if an element exists in the DOM
 * @param selector Query selection string
 * @returns Boolean element exists or not
 */
export function elementExists(selector: string): boolean {
  return !!document.querySelector(selector);
}
/**
 * Hides the specified element by setting its display style to 'none'
 * @param selector Query selection string
 */
export function hideElement(selector: string): void {
  const element = document.querySelector(selector) as HTMLElement;
  if (element) {
    element.style.display = 'none';
  }
}