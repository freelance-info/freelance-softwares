import React from "react";
import "./Invoice.css";
import { printToPdf } from "../utils/print";

// Facture
export default function Invoice({ parameters, invoice }) {
  return (
    <section>
      <button
        className="ui icon button green"
        onClick={() => printToPdf()}
        title="Facture"
      >
        <i aria-hidden="true" className="print icon"></i>
      </button>
      <div className="invoice-box">
        <table cellpadding="0" cellspacing="0">
          <tbody>
            <tr className="top">
              <td colspan="2">
                <table>
                  <tr>
                    <td className="title">
                      <img
                        src="https://www.sparksuite.com/images/logo.png"
                        alt="logo"
                        style={{ width: "100%", maxWidth: "300px" }}
                      />
                    </td>

                    <td>
                      Invoice #: 123
                      <br />
                      Created: January 1, 2015
                      <br />
                      Due: February 1, 2015
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr className="information">
              <td colspan="2">
                <table>
                  <tr>
                    <td>
                      Sparksuite, Inc.
                      <br />
                      12345 Sunny Road
                      <br />
                      Sunnyville, CA 12345
                    </td>

                    <td>
                      Acme Corp.
                      <br />
                      John Doe
                      <br />
                      john@example.com
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr className="heading">
              <td>Payment Method</td>

              <td>Check #</td>
            </tr>

            <tr className="details">
              <td>Check</td>

              <td>1000</td>
            </tr>

            <tr className="heading">
              <td>Item</td>

              <td>Price</td>
            </tr>

            <tr className="item">
              <td>Website design</td>

              <td>$300.00</td>
            </tr>

            <tr className="item">
              <td>Hosting (3 months)</td>

              <td>$75.00</td>
            </tr>

            <tr className="item last">
              <td>Domain name (1 year)</td>

              <td>$10.00</td>
            </tr>

            <tr className="total">
              <td></td>

              <td>Total: $385.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
