import React, { useState, useEffect, useMemo } from "react";
import { Tab } from "semantic-ui-react";
import { Parameters, ParametersContext } from "@freelance-info/common";
import Invoices from "./components/Invoices";
import Logo from "./Logo/Logo";
import { PARAMETER_KEYS, PARAMETER_ENTREPRISE_NAME } from "./utils/globals";
import { PrintContext } from "./contexts/print.context";

function App() {
  // Initialize parameters
  const [parameters, setParameters] = useState(new Map());
  const [version, setVersion] = useState(undefined);
  const [showParam, setShowParam] = useState(false);
  useEffect(() => {
    // Version
    let theVersion = "";
    if (window && window.require) {
      theVersion = window.require("@electron/remote")?.app?.getVersion();
    }
    setVersion(theVersion);

    // Window title
    let title = "Freelance-compta";
    if (parameters.has(PARAMETER_ENTREPRISE_NAME)) {
      title += ` de ${parameters.get(PARAMETER_ENTREPRISE_NAME)}`;
    }
    const titleElement = document.querySelector("title");
    if (titleElement && titleElement.innerText) {
      titleElement.innerText = title;
    }
  }, [parameters]);

  // PRINT
  const [printOrder, setPrintOrder] = useState(false);

  const invoicesElement = useMemo(
    () => <Invoices parameters={parameters} />,
    [parameters]
  );

  // Tabs
  const panes = [
    {
      menuItem: "Factures",
      render: () => <Tab.Pane>{invoicesElement} </Tab.Pane>,
    },
  ];

  return (
    <ParametersContext.Provider value={[parameters, setParameters]}>
      <PrintContext.Provider value={[printOrder, setPrintOrder]}>
        <main
          style={{ padding: "10px", display: "flex", flexDirection: "column" }}
        >
          {printOrder && invoicesElement}
          {!printOrder && (
            <>
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-end",
                }}
              >
                <div
                  style={{
                    marginRight: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {`Version ${version}`}
                </div>

                <button
                  className="ui icon button gray"
                  style={{ alignSelf: "flex-end" }}
                  onClick={() => setShowParam(true)}
                  title="Paramètres"
                >
                  <i className="cog icon"></i>
                </button>
                <Parameters
                  parameterKeys={PARAMETER_KEYS}
                  Logo={Logo}
                  open={showParam}
                  setOpen={setShowParam}
                />
              </div>
              <Tab panes={panes}></Tab>
            </>
          )}
        </main>
      </PrintContext.Provider>
    </ParametersContext.Provider>
  );
}

export default App;
