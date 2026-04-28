/**
 * Contains configuration and utility functions to be more compatible with PETA forms
 * Where, generally, the remainder of the functions in this codebase are more universal in application
 */
interface ENFieldPopulatorConfig {
  cookie_name: string;
  remote_origin: string;
  remote_path: string;
  fn_donation_amount_radios?: string;
  fn_donation_amount_other_input?: string;
  fn_donation_recurr_pay_radios?: string;
  fid_donation_amount_other_checkbox?: string;
  enabled_domains: string[];
}
export const EN_FIELD_POPULATOR_CONFIG: ENFieldPopulatorConfig = {
  cookie_name: 'ens_frm_data',
  enabled_domains: [
    // PETA.org
    'www.peta.org',
    'stage.peta.org',
    'dev.peta.org',
    'action.peta.org',

    // PETA Headlines
    'headlines.peta.org',
    'stageheadlines.peta.org',
    'devheadlines.peta.org',

    // PETA Investigations
    'investigations.peta.org',
    'stageinvestigations.peta.org',
    'devinvestigations.peta.org',

    // PETA Engaging Networks
    'support.peta.org',
    'petapack.peta.org',
    'fundraise.peta.org',
    'memorials.peta.org',
    'us.e-activist.com',

    // PETA Latino
    'www.petalatino.com',
    'support.petalatino.com',
    'investigaciones.petalatino.com',

    // PETA Kids
    'www.petakids.com',
    'action.petakids.com',
    'support.petakids.com',

    //peta2
    'www.peta2.com',
    'action.peta2.com'

  ],
  remote_origin: 'https://www.peta.org',
  remote_path: '/wp-content/plugins/peta-middleware-api/data-remember.html'
}
export const EN_FIELDS_TO_HIDE = [
  '.expressCheckout_label',
  '.en__field--NOT_TAGGED_69',
  '.en__field--emailAddress',
  '.en__field--country',
  '.en__field--firstName',
  '.en__field--lastName',
  '.en__field--address1',
  '.en__field--address2',
  '.en__field--city',
  '.en__field--region',
  '.en__field--postcode'
]
export function is_peta_latino(): boolean {
  return window.location.hostname.toLowerCase().indexOf('petalatino') !== -1;
}
declare global {
  class ENFieldPopulator {
    constructor(config: ENFieldPopulatorConfig);
    autofill(done?: (data: Record<string, string> | null) => void): void;
    save(field_names: string[], fill: boolean, done: (data: Record<string, string> | null) => void): void;
    clear(skip_fields: string[], done: (data: Record<string, string> | null) => void): void;
    clear_field(field_name: string, done: (data: Record<string, string> | null) => void): void;
    // Other existing objects exist, but are not relevant for this compatibility layer, such as remote_storage
  }
  interface Window {
    pageJson: any;
  }
}