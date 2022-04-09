import {
    Message, FileButtons, BottomButtons, Table, LinesContext, scrollToBottom,
} from '@freelance-info/common';
import { useState, useMemo, useReducer } from 'react';
import { DATE_COL_ID, SCROLLABLE_ELEMENT_ID, UNIQUE_KEY_COL_ID } from '../utils/globals';
import { linesInitialState } from '../reducers/lines.initialState';
import { linesReducer } from '../reducers/lines.reducers';
import Invoice from './Invoice';

// Facture
export default function Invoices({parameters}) {
    const [{
        selectedLines,
        highlightedLines,
        lines,
        cols,
        unsaved,
      }, dispatchLinesAction] = useReducer(linesReducer, linesInitialState);
    const linesContextValue = useMemo(() => ([{
        selectedLines,
        highlightedLines,
        lines,
        cols,
        unsaved,
    }, dispatchLinesAction]), [selectedLines, highlightedLines, lines, cols, unsaved, dispatchLinesAction]);
    
    // ACTION MESSAGE
    const [actionMessage, setActionMessage] = useState(undefined);

    // ERRORS
    const [lineErrors, setLineErrors] = useState([]);

    // LINES
    const addLine = () => {
        dispatchLinesAction({ type: 'addLine', uniqueKeyColId: UNIQUE_KEY_COL_ID });
        setTimeout(() => scrollToBottom(`#${SCROLLABLE_ELEMENT_ID}`), 200);
    };
    // Return error object if any for given line
    const validateLine = (line, lineNumber, columns) => ({
      lineNumber,
      cols: columns.filter(col => col.required && !line[col.id]),
    });

    // SHOW DETAILS
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const invoiceElement = useMemo(() => (
        <Invoice
            parameters={parameters}
            invoice={selectedInvoice}
            setSelectedInvoice={setSelectedInvoice}
        />
    ), [selectedInvoice, parameters]); 

    return (
        <>
        { selectedInvoice && invoiceElement}
        { !selectedInvoice &&  (
            <LinesContext.Provider value={linesContextValue}>
                <article>
                    <section className="buttons-bar border-bottom">
                        <FileButtons
                            hasUnsavedChanges={unsaved}
                            onError={err => setActionMessage({ type: 'negative', message: err.message ?? err })}
                            sortBy={DATE_COL_ID}
                            setLineErrors={setLineErrors}
                            fileChange={() => {}}
                            setActionMessage={setActionMessage}
                            validateLine={validateLine}
                            scrollableElementId={SCROLLABLE_ELEMENT_ID}
                            uniqueKeyColId={UNIQUE_KEY_COL_ID}
                        />
                        {actionMessage && <Message type={actionMessage.type} message={actionMessage.message} />}
                    </section>
            
                    <section id={SCROLLABLE_ELEMENT_ID} style={{ height: '75vh', overflow: 'auto' }}>
                        <Table
                            uniqueKeyColId={UNIQUE_KEY_COL_ID}
                            allSelected={selectedLines.length > 0 && selectedLines.length === lines.length}
                            errors={lineErrors}
                            scrollableElementId={SCROLLABLE_ELEMENT_ID}
                            parameters={parameters}
                            rowDetails={(selectedInvoice) => setSelectedInvoice(selectedInvoice)}
                        />
                    </section>
            
                    <section className="buttons-bar border-top">
                        <BottomButtons addLine={addLine} />
                    </section>
                </article>
            </LinesContext.Provider>
        )}
        </>
    );
}