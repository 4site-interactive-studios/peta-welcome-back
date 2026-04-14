const tippy = require("tippy.js").default;

export class RememberMe {
  static init() {
    console.log("RememberMe initialized");
    const rememberMeInfo = `
				Check “Remember me” to complete forms on this device faster. 
				While your financial information won’t be stored, you should only check this box from a personal device. 
				Click “Clear autofill” to remove the information from your device at any time.
			`;
    tippy("#rememberme-learn-more-toggle", { content: rememberMeInfo });
  }
}