export const PARAMETER_ENTREPRISE_NAME = "Nom de l'entreprise";
export const PARAMETER_ENTREPRISE_ADDRESS = "Adresse de l'entreprise";
export const PARAMETER_DEFAULT_VAT = 'Taux de TVA par défaut';
export const PARAMETER_DEFAULT_CASHING = "Mode d'encaissement par défaut";
export const PARAMETER_DEFAULT_CREDIT_ACCOUNT = 'Compte à créditer par défaut';
export const PARAMETER_ENTREPRISE_NATIONAL_ID = 'SIRET ou SIREN, code NAF, forme juridique, capital social et code RCS';
export const PARAMETER_ENTREPRISE_VAT_ID = "Numéro d'identification TVA";
export const UNIQUE_KEY_COL_ID = 'id';
export const INVOICE_NUMBER_COL_ID = 'ref';
export const DATE_COL_ID = 'date';
export const VAT_TYPE_COL_ID = 'typeTva';
export const VAT_RATE_COL_ID = 'tva';
export const AMOUNT_EXCLUDING_TAX_COL_ID = 'ht';
export const AMOUNT_INCLUDING_TAX_COL_ID = 'ttc';
export const CLIENT_NAME_COL_ID = 'clientName';
export const CLIENT_ADDRESS_COL_ID = 'clientAddress';
export const NATURE_COL_ID = 'nature';
export const NUMBER_OF_UNITS_COL_ID = 'numberOfUnits';
export const UNIT_PRICE_EXCLUDING_TAX_COL_ID = 'unitPriceExcludingTax';



export const VAT_RATES = [
    { key: '20', text: '20%', value: '20' },
    { key: '10', text: '10%', value: '10' },
    { key: '5.5', text: '5,5%', value: '5.5' },
    { key: '2.1', text: '2,1%', value: '2.1' },
    { key: '0', text: '0%', value: '0' },
  ];

export const PARAMETER_KEYS = new Map();
PARAMETER_KEYS.set(PARAMETER_ENTREPRISE_NAME, null);
PARAMETER_KEYS.set(PARAMETER_ENTREPRISE_ADDRESS, null);
PARAMETER_KEYS.set(PARAMETER_ENTREPRISE_NATIONAL_ID, null);
PARAMETER_KEYS.set(PARAMETER_ENTREPRISE_VAT_ID, null);
PARAMETER_KEYS.set(PARAMETER_DEFAULT_VAT, VAT_RATES);
PARAMETER_KEYS.set(PARAMETER_DEFAULT_CASHING, [
  { key: 'Virement', text: 'Virement', value: 'Virement' },
  { key: 'CB', text: 'CB', value: 'CB' },
  { key: 'Espèces', text: 'Espèces', value: 'Espèces' },
  { key: 'Chèque', text: 'Chèque', value: 'Chèque' },
  { key: 'Effets', text: 'Effets de commerce', value: 'Effets de commerce' },
  { key: 'Virement', text: 'Virement commercial (SIT)', value: 'Virement commercial (SIT)' },
]);
PARAMETER_KEYS.set(PARAMETER_DEFAULT_CREDIT_ACCOUNT, null);

export const SCROLLABLE_ELEMENT_ID = 'invoices-scrollable-container';

export const OPTIONS_CASHING = [
    { key: 'Virement', text: 'Virement', value: 'Virement' },
    { key: 'CB', text: 'CB', value: 'CB' },
    { key: 'Espèces', text: 'Espèces', value: 'Espèces' },
    { key: 'Chèque', text: 'Chèque', value: 'Chèque' },
    { key: 'Effets de commerce', text: 'Effets de commerce', value: 'Effets de commerce' },
    { key: 'Virement commercial (SIT)', text: 'Virement commercial (SIT)', value: 'Virement commercial (SIT)' },
];

