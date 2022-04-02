import {
    Message, FileButtons, BottomButtons, Table, LinesContext, scrollToBottom,
} from '@freelance-info/common';
import { useState, useMemo, useReducer } from 'react';
import { DATE_COL_ID, UNIQUE_KEY_COL_ID } from '../utils/globals';
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
        dispatchLinesAction({ type: 'addLine' });
        setTimeout(() => scrollToBottom(`#table-container`), 200);
    };
    // Return error object if any for given line
    const validateLine = (line, lineNumber, columns) => ({
      lineNumber,
      cols: columns.filter(col => col.required && !line[col.id]),
    });

    // SHOW DETAILS
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    return (
        <>
        { selectedInvoice && <Invoice parameters={parameters} invoice={selectedInvoice} /> }
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
                        />
                        {actionMessage && <Message type={actionMessage.type} message={actionMessage.message} />}
                    </section>
            
                    <section id="table-container" style={{ height: '75vh', overflow: 'auto' }}>
                        <Table
                            uniqueKeyColId={UNIQUE_KEY_COL_ID}
                            allSelected={selectedLines.length > 0 && selectedLines.length === lines.length}
                            errors={lineErrors}
                            scrollableElementId="table-container"
                            setActionMessage={setActionMessage}
                            parameters={parameters}
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