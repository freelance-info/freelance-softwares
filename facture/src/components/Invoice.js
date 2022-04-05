import React, { useContext, useEffect } from "react";
import { addVat } from "@freelance-info/common";
import {
  DATE_COL_ID,
  INVOICE_NUMBER_COL_ID,
  PARAMETER_ENTREPRISE_NAME,
  PARAMETER_ENTREPRISE_ADDRESS,
  CLIENT_NAME_COL_ID,
  CLIENT_ADDRESS_COL_ID,
  NATURE_COL_ID,
  PARAMETER_DEFAULT_CASHING,
  PARAMETER_DEFAULT_CREDIT_ACCOUNT,
  VAT_RATE_COL_ID,
  UNIT_PRICE_EXCLUDING_TAX_COL_ID,
  NUMBER_OF_UNITS_COL_ID,
  PARAMETER_ENTREPRISE_NATIONAL_ID,
  PARAMETER_ENTREPRISE_VAT_ID,
} from "../utils/globals";
import "./Invoice.css";
import { printToPdf } from "../utils/print";
import { PrintContext } from "../contexts/print.context";

// Facture
export default function Invoice({ parameters, invoice, setSelectedInvoice }) {
  const dueDate = new Date(invoice[DATE_COL_ID]);
  dueDate.setDate(dueDate.getDate() + 30);
  const amountExcludingTax =
    invoice[NUMBER_OF_UNITS_COL_ID] * invoice[UNIT_PRICE_EXCLUDING_TAX_COL_ID];
  const amountIncludingTax = addVat(
    invoice[VAT_RATE_COL_ID],
    amountExcludingTax
  );

  const [printerOrder, setPrintOrder] = useContext(PrintContext);
  const print = () => {
    setPrintOrder(true);
  };

  useEffect(() => {
    if (printerOrder) {
      printToPdf()
        .then(() => {
          setPrintOrder(false);
        })
        .catch((err) => {
          setPrintOrder(false);
        });
    }
  }, [printerOrder, setPrintOrder]);

  return (
    <section>
      {!printerOrder && (
        <>
          <button
            className="ui icon button green"
            onClick={() => setSelectedInvoice(undefined)}
            title="Retour"
          >
            <i
              aria-hidden="true"
              className="arrow alternate circle left icon"
            ></i>
          </button>
          <button
            className="ui icon button green"
            onClick={print}
            title="Facture"
          >
            <i aria-hidden="true" className="print icon"></i>
          </button>
        </>
      )}
      <div className={[printerOrder ? '' : 'box-shadow', 'invoice-box'].join(' ')}>
        <table cellPadding="0" cellSpacing="0">
          <tbody>
            <tr className="top">
              <td colSpan="2">
                <table>
                  <tbody>
                    <tr>
                      <td className="title">FACTURE</td>

                      <td>
                        Facture #: {invoice[INVOICE_NUMBER_COL_ID]}
                        <br />
                        Créée le :{" "}
                        {new Date(invoice[DATE_COL_ID]).toLocaleDateString(
                          "fr-FR"
                        )}
                        <br />A régler avant le :{" "}
                        {dueDate.toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr className="information">
              <td colSpan="2">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <div style={{fontWeight: 'bold'}}>
                          {parameters.get(PARAMETER_ENTREPRISE_NAME)}
                        </div>
                        <div style={{ whiteSpace: "pre-line" }}>
                          {parameters.get(PARAMETER_ENTREPRISE_ADDRESS)}
                        </div>
                        <div>
                          {parameters.get(PARAMETER_ENTREPRISE_NATIONAL_ID)}
                        </div>
                        <div>
                          Numéro d'identification à la TVA : {parameters.get(PARAMETER_ENTREPRISE_VAT_ID)}
                        </div>
                      </td>

                      <td>
                        <strong>{invoice[CLIENT_NAME_COL_ID]}</strong>
                        <br />
                        <span style={{ whiteSpace: "pre-line" }}>
                          {invoice[CLIENT_ADDRESS_COL_ID]}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr className="heading">
              <td>Méthode de paiement</td>

              <td>Numéro de compte</td>
            </tr>
            <tr className="details">
              <td>{parameters.get(PARAMETER_DEFAULT_CASHING)}</td>

              <td>{parameters.get(PARAMETER_DEFAULT_CREDIT_ACCOUNT)}</td>
            </tr>
            <tr className="heading">
              <td>Désignation</td>
              <td>Montant</td>
            </tr>
            <tr className="item last">
              <td>
                <div>
                  {invoice[NATURE_COL_ID]} : {invoice[NUMBER_OF_UNITS_COL_ID]}{" "}
                  jours de prestation
                </div>
                <div>
                  (Taux journalier : {invoice[UNIT_PRICE_EXCLUDING_TAX_COL_ID]}€
                  HT)
                </div>
              </td>
              <td>{amountExcludingTax}€</td>
            </tr>
            <tr className="item last">
              <td>TVA ({invoice[VAT_RATE_COL_ID]}%)</td>
              <td>{amountIncludingTax - amountExcludingTax}€</td>
            </tr>
            <tr className="total">
              <td></td>
              <td>Total TTC: {amountIncludingTax}€</td>
            </tr>
          </tbody>
        </table>
        <i>Une indemnité forfaitaire de 40€ sera appliquée pour les frais de recouvrement en cas de retard de paiement.</i>
      </div>
    </section>
  );
}
