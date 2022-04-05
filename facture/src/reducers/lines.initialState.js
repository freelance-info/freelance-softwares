import {
  PARAMETER_DEFAULT_VAT,
  INVOICE_NUMBER_COL_ID,
  DATE_COL_ID,
  VAT_RATE_COL_ID,
  UNIT_PRICE_EXCLUDING_TAX_COL_ID,
  UNIQUE_KEY_COL_ID,
  CLIENT_NAME_COL_ID,
  CLIENT_ADDRESS_COL_ID,
  NATURE_COL_ID,
  NUMBER_OF_UNITS_COL_ID,
} from '../utils/globals';

export const linesInitialState = {
  cols: [
    { id: UNIQUE_KEY_COL_ID, title: 'Id', type: 'Text', required: true, width: '0' },
    { id: DATE_COL_ID, title: 'Date émission facture', type: 'Date', required: true, width: '150px' },
    { id: INVOICE_NUMBER_COL_ID, title: 'Réf. de la facture', type: 'Text', required: false, width: '75px' },
    { id: CLIENT_NAME_COL_ID, title: 'Client (Raison sociale)', type: 'Text', required: false, width: '100px' },
    { id: CLIENT_ADDRESS_COL_ID, title: 'Adresse du client', type: 'Text', required: false, width: '100px' },
    { id: NATURE_COL_ID, title: 'Nature', type: 'Text', required: true, width: '150px' },
    { id: VAT_RATE_COL_ID, title: 'TVA', type: 'Select', required: false, width: '50px', defaultParamKey: PARAMETER_DEFAULT_VAT },
    { id: NUMBER_OF_UNITS_COL_ID, title: 'Nombre de jours', type: 'Number', required: true, width: '100px' },
    { id: UNIT_PRICE_EXCLUDING_TAX_COL_ID, title: 'Montant HT par jour', type: 'Price', required: false, width: '100px' },
    { id: 'details', title: 'Détails', type: 'Button', required: false, width: '60px' },
  ],
  lines: [],
  selectedLines: [],
  highlightedLines: [],
  unsaved: false,
};
