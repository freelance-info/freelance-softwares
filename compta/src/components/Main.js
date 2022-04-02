import React, { useState, useReducer, useMemo } from 'react';
import { instanceOf, func } from 'prop-types';
import {
  Message, Search, FileButtons, BottomButtons, Table, scrollToBottom, LinesContext,
} from '@freelance-info/common';
import { searchLines } from '../utils/search';
import { linesReducer, linesInitialState } from '../reducers/lines.reducer';
import { VAT } from './VAT';
import { DATE_COL_ID, UNIQUE_KEY_COL_ID } from '../utils/globals';

// Account Ledger ("Livre des recettes" in french)
const Main = ({ parameters, fileChange }) => {
  const [actionMessage, setActionMessage] = useState(undefined);

  // COLUMN DEFINITION
  const [showVat, setShowVat] = useState(false);
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

  const vat = () => {
    setShowVat(true);
  };

  // ERRORS
  const [lineErrors, setLineErrors] = useState([]);

  // SEARCH
  const [searchResults, setSearchResults] = useState(undefined);
  // Search the given col for text, then scroll to it
  const search = (searchText, searchColId) => {
    setSearchResults(searchLines(lines, searchText, searchColId, searchResults));
  };

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

  return (
    <LinesContext.Provider value={linesContextValue}>
      <article>

        <section className="buttons-bar border-bottom">
          <FileButtons
            hasUnsavedChanges={unsaved}
            onError={err => setActionMessage({ type: 'negative', message: err.message ?? err })}
            sortBy={DATE_COL_ID}
            setLineErrors={setLineErrors}
            fileChange={fileChange}
            setActionMessage={setActionMessage}
            validateLine={validateLine}
          />
          {actionMessage && <Message type={actionMessage.type} message={actionMessage.message} />}
          <Search cols={cols} onChange={() => setSearchResults([])} onSearchClick={search} />
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
          <BottomButtons addLine={addLine}>
            <Button
              color="pink"
              labelPosition="right"
              icon="table"
              content="Déclaration TVA"
              onClick={vat}
            />
          </BottomButtons>
        </section>

        {
          showVat && <VAT open={showVat} setOpen={setShowVat} cols={cols} lines={lines} />
        }
      </article>
    </LinesContext.Provider>
  );
};

Main.propTypes = {
  parameters: instanceOf(Map).isRequired,
  fileChange: func.isRequired,
};

export default Main;
