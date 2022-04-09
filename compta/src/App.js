import React, { useEffect, useState } from 'react';
import { Tab, Menu } from 'semantic-ui-react';
import { Parameters, ParametersContext } from '@freelance-info/common';
import Main from './components/Main';
import { PARAMETER_KEYS, PARAMETER_ENTREPRISE_NAME } from './utils/globals';
import Logo from './Logo/Logo';

export const App = () => {
  const [showParam, setShowParam] = useState(false);
  const [parameters, setParameters] = useState(new Map());
  const [version, setVersion] = useState(undefined);
  const [tabFiles, setTabFiles] = useState([]);
  useEffect(() => {
    // Version
    let theVersion = '';
    if (window && window.require) {
      theVersion = window.require('@electron/remote')?.app?.getVersion();
    }
    setVersion(theVersion);

    // Window title
    let title = 'Freelance-compta';
    if (parameters.has(PARAMETER_ENTREPRISE_NAME)) {
      title += ` de ${parameters.get(PARAMETER_ENTREPRISE_NAME)}`;
    }
    const titleElement = document.querySelector('title');
    if (titleElement && titleElement.innerText) {
      titleElement.innerText = title;
    }
  }, [parameters]);

  const onTabFilesChange = filePath => {
    const newTabFiles = [...tabFiles];
    newTabFiles[0] = filePath;
    setTabFiles(newTabFiles);
  };

  // Tabs
  const displayableTabFiles = tabFiles.map(tabFile => {
    if (tabFile) {
      return (
        <Menu.Item key={tabFile} title={tabFile}>
          {new URL(`file:///${tabFile}`).pathname.split('/').pop()}
        </Menu.Item>
      );
    }
    return undefined;
  });
  const panes = [
    {
      menuItem: displayableTabFiles[0] || 'Nouveau fichier',
      render: () => (
        <Tab.Pane style={{ overflowX: 'auto' }}>
          <Main
            key="account-ledger"
            parameters={parameters}
            fileChange={onTabFilesChange}
          />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <ParametersContext.Provider value={[parameters, setParameters]}>
      <main
        style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}
      >
        <div
          style={{
            display: 'flex',
            alignSelf: 'flex-end',
            marginBottom: '-35px',
          }}
        >
          <div
            style={{
              marginRight: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {`Version ${version}`}
          </div>
          <button
            type="button"
            className="ui icon button gray"
            onClick={() => setShowParam(true)}
            title="Paramètres"
          >
            <i className="cog icon" />
          </button>
        </div>
        <Parameters
          parameterKeys={PARAMETER_KEYS}
          Logo={Logo}
          open={showParam}
          setOpen={setShowParam}
        />
        <Tab panes={panes} />
      </main>
    </ParametersContext.Provider>
  );
};

export default App;
