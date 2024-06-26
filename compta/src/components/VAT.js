/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */

// Value-Added Tax (TVA in french)
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useReducer,
} from 'react';
import {
  func, bool, instanceOf, arrayOf, shape, string,
} from 'prop-types';
import { Button, Form, Modal } from 'semantic-ui-react';
import { Table, LinesContext } from '@freelance-info/common';
import {
  CREDIT_TYPES,
  DATE_COL_ID,
  VAT_TYPE_COL_ID,
  VAT_RATES,
  VAT_RATE_COL_ID,
  AMOUNT_EXCLUDING_TAX_COL_ID,
  UNIQUE_KEY_COL_ID,
  SCROLLABLE_ELEMENT_ID,
} from '../utils/globals';
import { getQuarters, getStartDateOfQuarter, getEndDateOfQuarter } from '../utils/date';
import { linesReducer, linesInitialState } from '../reducers/lines.reducer';
import VAT_SVG from './VAT.svg';

export const VAT = ({ open, setOpen, parameters, lines: mainLines }) => {
  const [{
    selectedLines,
    highlightedLines,
    lines,
    cols,
    unsaved,
  }, dispatchLinesAction] = useReducer(linesReducer, {
    ...linesInitialState,
    lines: mainLines,
  });
  const vatLinesContextValue = useMemo(() => ([{
    selectedLines,
    highlightedLines,
    lines,
    cols: cols.filter(col => !['ref', 'debit', 'credit', 'mode'].includes(col.id)),
    unsaved,
  }, dispatchLinesAction]), [selectedLines, highlightedLines, lines, cols, unsaved, dispatchLinesAction]);

  const [startQuarter, setStartQuarter] = useState(null);
  const [endQuarter, setEndQuarter] = useState(null);
  const [filteredLines, setFilteredLines] = useState(lines);

  const quarterOptions = useMemo(() => {
    const dateMin = lines.reduce((min, line) => (!min || (line[DATE_COL_ID] && line[DATE_COL_ID] < min) ? line[DATE_COL_ID] : min), null);
    const dateMax = lines.reduce((max, line) => (!max || (line[DATE_COL_ID] && line[DATE_COL_ID] > max) ? line[DATE_COL_ID] : max), null);
    const quarters = getQuarters(dateMin, dateMax);
    const options = Object.keys(quarters).flatMap(year => quarters[year].map(quarter => (
      {
        key: `${year}-${quarter}`,
        value: `${year}-${quarter}`,
        text: `${year} - trimestre ${quarter}`,
      }
    )));
    setStartQuarter(options[0].value);
    setEndQuarter(options[options.length - 1].value);
    return options;
  }, [DATE_COL_ID, lines]);

  useEffect(() => {
    const startDate = getStartDateOfQuarter(startQuarter);
    const endDate = getEndDateOfQuarter(endQuarter);
    setFilteredLines(lines.filter(line => {
      const lineDate = line[DATE_COL_ID] ? new Date(line[DATE_COL_ID]) : null;
      return lineDate && lineDate > startDate && lineDate <= endDate;
    }));
  }, [cols, lines, startQuarter, endQuarter]);

  const toTaxableLine = useCallback(creditType => {
    const creditTypeSum = filteredLines
      .filter(l => l[VAT_TYPE_COL_ID] === creditType.value)
      .reduce((prev, cur) => prev + 1 * cur[AMOUNT_EXCLUDING_TAX_COL_ID], 0);
    return (
      <tr key={creditType.key}>
        <td>{creditType.text}</td>
        <td>
          <div className="ui right labeled input">
            <input type="text" value={creditTypeSum} readOnly />
            <div className="ui basic label">€</div>
          </div>
        </td>
      </tr>
    );
  }, [filteredLines]);

  const toVatLine = useCallback(rate => {
    const vatTypeSum = filteredLines
      .filter(l => l[VAT_RATE_COL_ID] === rate.value)
      .reduce((prev, cur) => prev + 1 * cur.ht, 0);
    const vatAmount = Math.round(vatTypeSum * rate.value) / 100;
    return (
      <tr key={rate.key}>
        <td>{rate.text}</td>
        <td>
          <div className="ui right labeled input">
            <input type="text" value={vatTypeSum} readOnly />
            <div className="ui basic label">€</div>
          </div>
        </td>
        <td>
          <div className="ui right labeled input">
            <input type="text" value={vatAmount} readOnly />
            <div className="ui basic label">€</div>
          </div>
        </td>
      </tr>
    );
  }, [filteredLines]);

  const taxableLines = useMemo(() => CREDIT_TYPES.filter(creditType => creditType.isTaxable).map(toTaxableLine), [filteredLines]);
  const notTaxableLines = useMemo(() => CREDIT_TYPES.filter(creditType => !creditType.isTaxable).map(toTaxableLine), [filteredLines]);
  const vatLines = useMemo(() => VAT_RATES.map(toVatLine), [filteredLines]);

  return (
    <Modal
      size="large"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>
        <div className="ui centered three column grid">
          <img src={VAT_SVG} alt="Logo Impots" style={{ width: '100px' }} className="ui column" />
          <h2 className="ui column">Déclaration de TVA N° 3310</h2>
          <div className="ui column" style={{ width: '100px', alignItems: 'center', display: 'flex' }}><Button color="black" onClick={() => setOpen(false)}>Fermer</Button></div>
        </div>
      </Modal.Header>
      <Modal.Content>
        <LinesContext.Provider value={vatLinesContextValue}>
          <main className="ui container">
            <section className="ui segments">
              <Form className="ui segment">
                <Form.Group>
                  <Form.Field inline>
                    <Form.Select
                      compact
                      style={{ width: '200px' }}
                      options={quarterOptions}
                      value={startQuarter}
                      onChange={(_event, { value: val }) => setStartQuarter(val)}
                      placeholder="Début de la période"
                    />
                  </Form.Field>
                  <Form.Field inline>
                    <Form.Select
                      compact
                      style={{ width: '200px' }}
                      options={quarterOptions}
                      value={endQuarter}
                      onChange={(_event, { value: val }) => setEndQuarter(val)}
                      placeholder="Fin de la période"
                    />
                  </Form.Field>
                </Form.Group>
              </Form>
              <details className="ui segment">
                <summary>Voir les lignes sélectionnées</summary>
                <Table
                  uniqueKeyColId={UNIQUE_KEY_COL_ID}
                  allSelected={false}
                  scrollableElementId={SCROLLABLE_ELEMENT_ID}
                  parameters={parameters}
                />
              </details>
              <section className="ui segment fluid">
                <h3>A - MONTANT DES OPERATIONS REALISEES</h3>
                <table className="ui celled table">
                  <thead>
                    <tr>
                      <th colSpan="2">OPÉRATIONS IMPOSABLES (HT)</th>
                    </tr>
                  </thead>
                  <tbody>{taxableLines}</tbody>
                  <thead>
                    <tr>
                      <th colSpan="2">OPÉRATIONS NON IMPOSABLES</th>
                    </tr>
                  </thead>
                  <tbody>{notTaxableLines}</tbody>
                </table>
                <table />
              </section>
              <section className="ui segment">
                <h3>B - DECOMPTE TVA À PAYER</h3>
                <table className="ui celled table">
                  <thead>
                    <tr>
                      <th>TVA BRUTE</th>
                      <th>BASE HT</th>
                      <th>TAXE DUE</th>
                    </tr>
                  </thead>
                  <tbody>{vatLines}</tbody>
                </table>
                <table />
              </section>
            </section>
          </main>
        </LinesContext.Provider>
      </Modal.Content>
    </Modal>
  );
};

VAT.propTypes = {
  open: bool,
  setOpen: func,
  parameters: instanceOf(Map).isRequired,
  lines: arrayOf(shape({ UNIQUE_KEY_COL_ID: string })).isRequired,
};

VAT.defaultProps = {
  open: false,
  setOpen: () => { },
};
