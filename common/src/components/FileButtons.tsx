import React, { useContext, useEffect, useState } from 'react';
import { func, bool, string } from 'prop-types';
import { ConfirmButton } from './ConfirmButton';
import { LinesContext, LinesContextType } from '../contexts/lines.context';
import { save, saveAs, open, readData } from '../utils/csv';
import { computeRowCellId } from '../utils/computations';
import { scrollTo } from '../utils/scroll';

const FileButtons = ({ hasUnsavedChanges, scrollableElementId, onError, sortBy, fileChange, setActionMessage, validateLine, setLineErrors }) => {
  const [{ cols, lines }, dispatchLinesAction] = useContext<LinesContextType>(LinesContext);
  const storedCurrentFile = localStorage.getItem('accountLedger');
  const [currentFile, setCurrentFile] = useState(undefined);

  // Write values to current file
  const checkErrors = (theLines, theCols) => new Promise((resolve, reject) => {
    // Check error on every existing lines
    const errorLines = theLines.map((line, lineNumber) => validateLine(line, lineNumber, theCols))
      .filter(error => error.cols.length > 0);

    // Perform save action if no error
    if (errorLines.length === 0) {
      setLineErrors(() => []);
      setActionMessage(undefined);
      resolve({});
    } else {
      setLineErrors(() => errorLines);
      const theColId = theCols.find(col => col.width !== '0').id;
      const colSelector = `#${computeRowCellId(errorLines[0].lineNumber, theColId)}`;
      setTimeout(() => scrollTo(`#${scrollableElementId}`, colSelector), 200);
      reject(new Error('Enregistrement impossible, veuillez corriger les erreurs'));
    }
  });

  useEffect(() => {
    if (!currentFile) {
      if (storedCurrentFile) {
        setCurrentFile(() => storedCurrentFile);
        fileChange(storedCurrentFile);
      }
    } else {
      if (currentFile !== storedCurrentFile) {
        localStorage.setItem('accountLedger', currentFile);
      }
      readData(currentFile, cols)
        .then(initLines => {
          dispatchLinesAction({ type: 'initLines', initLines });
        })
        .catch(error => {
          const message = `Problème avec le fichier "${currentFile}": ${error.message}`;
          onError(new Error(message));
        });
    }
  }, [currentFile]);

  const onNew = () => {
    localStorage.removeItem('accountLedger');
    setCurrentFile(null);
    setActionMessage(null);
    fileChange(null);
    dispatchLinesAction({ type: 'initLines', initLines: [] });
  };
  const onOpen = () => {
    open(currentFile, setCurrentFile, fileChange, setActionMessage, lines, cols)
      .then(initLines => dispatchLinesAction({ type: 'initLines', initLines }))
      .catch(onError);
  };
  const onSaveAs = () => {
    checkErrors(lines, cols)
      .then(() => saveAs(currentFile, setCurrentFile, fileChange, lines, cols, sortBy, setActionMessage))
      .then(initLines => dispatchLinesAction({ type: 'initLines', initLines }))
      .then(() => dispatchLinesAction({ type: 'saved' }))
      .catch(onError);
  };
  const onSave = () => {
    if (currentFile) {
      checkErrors(lines, cols)
        .then(() => save(currentFile, lines, cols, sortBy, setActionMessage))
        .then(initLines => dispatchLinesAction({ type: 'initLines', initLines }))
        .then(() => dispatchLinesAction({ type: 'saved' }))
        .catch(onError);
    } else {
      // If this is the 1st time app is launched, there is no currentFile: run saveAs
      onSaveAs();
    }
  };

  const newButtonClick = hasUnsavedChanges ? () => {} : onNew;
  const openButtonClick = hasUnsavedChanges ? () => {} : onOpen;

  const newButton = (
    <button
      key="newButton"
      type="button"
      className="ui icon button green"
      onClick={newButtonClick}
      title="Nouveau"
    >
      <i aria-hidden="true" className="file outline icon" />
    </button>
  );

  const openButton = (
    <button
      key="openButton"
      type="button"
      className="ui icon button green"
      onClick={openButtonClick}
      title="Ouvrir"
    >
      <i aria-hidden="true" className="folder open icon" />
    </button>
  );
  const saveButton = (
    <button
      key="saveButton"
      type="button"
      className="ui icon button green"
      onClick={onSave}
      title="Enregistrer"
    >
      <i aria-hidden="true" className="save icon" />
      { hasUnsavedChanges && <sup>●</sup> }
    </button>
  );
  const saveAsButton = (
    <button
      key="saveAsButton"
      type="button"
      className="ui icon button green"
      onClick={onSaveAs}
      title="Enregistrer sous"
    >
      <i aria-hidden="true" className="clone icon" />
    </button>
  );

  const buttons = [];

  if (hasUnsavedChanges) {
    const confirmText = 'Vos modifications ne sont pas encore enregistrées! Voulez-vous les perdre et continuer ?';
    buttons.push(<ConfirmButton key="newConfirmButton" text={confirmText} button={newButton} onOk={onNew} />);
    buttons.push(<ConfirmButton key="newOpenButton" text={confirmText} button={openButton} onOk={onOpen} />);
  } else {
    buttons.push(newButton);
    buttons.push(openButton);
  }

  buttons.push(saveButton);
  buttons.push(saveAsButton);

  return <div>{ buttons }</div>;
};

FileButtons.propTypes = {
  hasUnsavedChanges: bool.isRequired,
  sortBy: string,
  onError: func.isRequired,
  fileChange: func.isRequired,
  setActionMessage: func.isRequired,
  validateLine: func.isRequired,
  setLineErrors: func.isRequired,
  scrollableElementId: string.isRequired,
};

export default FileButtons;
