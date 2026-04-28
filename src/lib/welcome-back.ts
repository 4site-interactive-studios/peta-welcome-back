/**
 * WelcomeBack - Leverages PETA's existing remember-me script. Creates a Welcome Back block in a specified location
 * Handles clearing autofill by passing along interaction to remember-me
 * Hides fields when autofill was used
 */
import { EN_FIELD_POPULATOR_CONFIG, EN_FIELDS_TO_HIDE, is_peta_latino } from "./peta-compatability-layer";
import { Logger } from "./logger";
import { elementExists } from "./common";

interface WelcomeBackConfig {
    language?: string;
    location_selector: string;
    hide_clear_autofill: boolean;
    hide_change_paymenttype: boolean;
    conditional_hide_selectors: string[];
    run: boolean;
}

interface SupporterDetails {
    email: string;
    firstName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    region?: string;
    postcode?: string;
}

declare global {
    interface Window {
        WelcomeBackOptions?: Partial<WelcomeBackConfig>;
    }
}

const defaultConfig: WelcomeBackConfig = {
    location_selector: '.en__field--emailAddress',
    hide_clear_autofill: true,
    hide_change_paymenttype: false,
    conditional_hide_selectors: EN_FIELDS_TO_HIDE,
    run: true
};

export default class WelcomeBack {
    private config: WelcomeBackConfig;
    private logger = new Logger('WB-WelcomeBack');

    constructor() {
        this.config = { ...defaultConfig, language: is_peta_latino() ? 'es' : 'en', ...window.WelcomeBackOptions };
        this.setBodyData(false);
        if (this.shouldRun() && this.config.run) {
            this.logger.log("Initializing WelcomeBack", "🎉");
            this.createCSS();
            this.addListeners();
        } else {
            this.logger.log("WelcomeBack will not run. Conditions not met.", "⚠️");
        }
    }

    private shouldRun(): boolean {
        return elementExists('input[name="supporter.emailAddress"]') &&
            elementExists(this.config.location_selector) &&
            typeof ENFieldPopulator !== 'undefined';
    }

    private addListeners(): void {
        const autofillCompleteHandler = () => {
            this.logger.log("Autofill complete event detected");
            this.showWelcomeBackBlock();
        };

        const autofillClearedHandler = () => {
            this.logger.log("Clear autofill event detected");
            this.setBodyData(false);
        };

        if (this.getSupporterDetails() !== null) {
            this.logger.log("Supporter details found");
            this.showWelcomeBackBlock();
        } else {
            this.logger.log("Supporter details not found. Waiting for autofillComplete event.");
            document.addEventListener('autofillComplete', autofillCompleteHandler);
        }
        document.addEventListener('autofillCleared', autofillClearedHandler);
    }

    private showWelcomeBackBlock(): void {
        const supporterDetails = this.getSupporterDetails();
        if (!supporterDetails) {
            this.logger.log("Supporter details not found. Cannot display Welcome Back block.", "⚠️");
            return;
        }
        const insertLocation = document.querySelector(this.config.location_selector);
        if (!insertLocation) {
            this.logger.log("Insert location not found", "🔴");
            return;
        }

        const welcomeBackBlock = this.createWelcomeBackBlock(supporterDetails);
        insertLocation.insertAdjacentElement('afterend', welcomeBackBlock);

        this.addEditButtonListener();
        this.setBodyData(true);
    }

    private createWelcomeBackBlock(details: SupporterDetails): HTMLElement {
        const block = document.createElement('div');
        block.className = 'welcome-back';
        if (this.config.language === 'es') {
            block.innerHTML = `
                <div>
                    <h4>Bienvenido de nuevo${details.firstName ? `, ${details.firstName}` : ''}!</h4>
                    <p>
                        ${details.address1 ?? ''}
                        ${details.address2 ? `<br>${details.address2}` : ''}
                        <br>${details.city ?? ''}${details.city && (details.region || details.postcode) ? ',' : ''} ${details.region ?? ''} ${details.postcode ?? ''}
                    </p>
                </div>
                <span class="edit" id="welcome-back-edit">Editar</span>
            `;
        } else {
            block.innerHTML = `
                <div>
                    <h4>Welcome back, ${details.firstName ?? 'Friend'}!</h4>
                    <p>
                        ${details.address1 ?? ''}
                        ${details.address2 ? `<br>${details.address2}` : ''}
                        <br>${details.city ?? ''}${details.city && (details.region || details.postcode) ? ',' : ''} ${details.region ?? ''} ${details.postcode ?? ''}
                    </p>
                </div>
                <span class="edit" id="welcome-back-edit">Edit</span>
            `;
        }
        return block;
    }

    private addEditButtonListener(): void {
        document.getElementById('welcome-back-edit')?.addEventListener('click', () => {
            this.logger.log("Edit button clicked. Clearing auto-filled supporter details.");
            const clearAutofillButton = document.querySelector('#clear-autofill-data');
            if (clearAutofillButton) {
                clearAutofillButton.dispatchEvent(new Event('click'));
            } else {
                this.clearFieldsWithCompatibilityLayer();
            }
        });
    }

    private clearFieldsWithCompatibilityLayer(): void {
        const efp = new ENFieldPopulator(EN_FIELD_POPULATOR_CONFIG);
        const skipFields = (window.pageJson && window.pageJson.supporterId) ? ['supporter.emailAddress'] : [];
        efp.clear(skipFields, (data) => {
            if (data) {
                this.logger.log("Auto-filled fields cleared successfully.");
            } else {
                this.logger.log("Failed to clear auto-filled fields.", "🔴");
            }
            this.setBodyData(false);
        });
    }

    private getSupporterDetails(): SupporterDetails | null {
        const email = this.getInputValue('input[name="supporter.emailAddress"]');
        const firstName = this.cleanInput('input[name="supporter.firstName"]');
        const address1 = this.cleanInput('input[name="supporter.address1"]');
        const address2 = this.cleanInput('input[name="supporter.address2"]');
        const city = this.cleanInput('input[name="supporter.city"]');
        const region = this.cleanInput('select[name="supporter.region"]');
        const postcode = this.cleanInput('input[name="supporter.postcode"]');

        if (!email || !this.areRequiredFieldsFilled({ firstName, address1, city, region, postcode })) {
            this.logger.log("Supporter details incomplete.", "⚠️");
            return null;
        }

        return { email, firstName, address1, address2, city, region, postcode };
    }

    private areRequiredFieldsFilled(details: Partial<SupporterDetails>): boolean {
        return Object.entries(details).every(([key, value]) => {
            const isRequired = document.querySelector(`.en__field--${key}.en__mandatory`) !== null;
            return !isRequired || !!value;
        });
    }

    private getInputValue(selector: string): string | undefined {
        const input = document.querySelector(selector) as HTMLInputElement | HTMLSelectElement;
        return input?.value;
    }

    private cleanInput(selector: string): string | undefined {
        const value = this.getInputValue(selector);
        return value?.replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '').trim();
    }

    private createCSS(): void {
        if (!this.config.conditional_hide_selectors) return;
        let stylesheet = `
            ${this.config.conditional_hide_selectors.map(selector => `[data-welcome-back="true"] ${selector}`).join(', ')} {
                display: none !important;
            }
        `;
        if (this.config.hide_change_paymenttype) {
            stylesheet += '#clear-payment-data { display: none !important; }';
        }
        if (this.config.hide_clear_autofill) {
            stylesheet += '#clear-autofill-data { display: none !important; }';
        }
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(stylesheet));
        document.head.appendChild(style);
    }

    private setBodyData(value: boolean): void {
        document.body.setAttribute('data-welcome-back', value ? 'true' : 'false');
    }

}