import React, { useState, useEffect } from 'react';
import { Tab } from 'semantic-ui-react';
import { Parameters } from '@freelance-info/common';
import Invoices from './components/Invoices';
import Logo from './Logo/Logo';
import { PARAMETER_KEYS, PARAMETER_ENTREPRISE_NAME } from './utils/globals';

function App() {

  // Initialize parameters
  const [parameters, setParameters] = useState(new Map());
  const [showParam, setShowParam] = useState(false);
  useEffect(() => {
    if (parameters.size === 0) {
      // Try to load from local storage
      const savedParameters = new Map();
      PARAMETER_KEYS.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          savedParameters.set(key, value);
        }
      });
      if (savedParameters.size < PARAMETER_KEYS.length) {
        // If parameters are missing, open the parameter popup to force user to set them
        setShowParam(true);
      }
      setParameters(savedParameters);
    }
  }, [setParameters]);

  // Window title
  useEffect(() => {
    let title = 'Facturation';
    if (parameters.has(PARAMETER_ENTREPRISE_NAME)) {
      title += ` de ${parameters.get(PARAMETER_ENTREPRISE_NAME)}`;
    }
    document.querySelector('title').innerText = title;
  }, [parameters]);

  // Tabs
  const panes = [
    { menuItem: 'Factures', render: () => <Tab.Pane><Invoices parameters={parameters}></Invoices> </Tab.Pane> },
  ];

  const onSaveParameters = (parametersValue) => {
    setParameters(parametersValue);
    PARAMETER_KEYS.forEach((_value, parameterKey) => localStorage.setItem(parameterKey, parametersValue.get(parameterKey)));
    setShowParam(false);
  }
  
  return (
    <main style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
      <button className="ui icon button gray" style={ {alignSelf: 'flex-end', marginBottom: '-35px' }} onClick={() => setShowParam(true)} title="Paramètres">
          <i className="cog icon"></i>
      </button>
      <Parameters
        parameterKeys={PARAMETER_KEYS}
        initialParametersValue={parameters}
        Logo={Logo}
        open={showParam}
        close={onSaveParameters}
      />
      <Tab panes={panes}></Tab>
    </main>
  );
}

export default App;
