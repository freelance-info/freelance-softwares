import {
  PARAMETER_DEFAULT_VAT,
  INVOICE_NUMBER_COL_ID,
  DATE_COL_ID,
  VAT_RATE_COL_ID,
  AMOUNT_EXCLUDING_TAX_COL_ID,
  UNIQUE_KEY_COL_ID,
} from '../utils/globals';

export const linesInitialState = {
  cols: [
    { id: UNIQUE_KEY_COL_ID, title: 'Id', type: 'Text', required: true, width: '0' },
    { id: DATE_COL_ID, title: 'Date émission facture', type: 'Date', required: true, width: '150px' },
    { id: INVOICE_NUMBER_COL_ID, title: 'Réf. de la facture', type: 'Text', required: false, width: '75px' },
    { id: 'client', title: 'Client', type: 'Text', required: false, width: '100px' },
    { id: 'nature', title: 'Nature', type: 'Text', required: true, width: '150px' },
    { id: VAT_RATE_COL_ID, title: 'TVA', type: 'Select', required: false, width: '50px', defaultParamKey: PARAMETER_DEFAULT_VAT },
    { id: AMOUNT_EXCLUDING_TAX_COL_ID, title: 'Montant HT', type: 'Number', required: false, width: '100px' },
    { id: 'ttc', title: 'Montant TTC', type: 'Number', required: true, width: '100px' },
  ],
  lines: [],
  selectedLines: [],
  highlightedLines: [],
  unsaved: false,
};
