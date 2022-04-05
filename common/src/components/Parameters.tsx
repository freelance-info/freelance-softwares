import React, { useState, useEffect, useContext } from 'react';
import { Modal, Form, Button, Select, DropdownItemProps } from 'semantic-ui-react';
import { func, instanceOf, bool, string } from 'prop-types';
import { ParametersContext } from '../contexts/parameters.context';

type ParametersType = {
  open: boolean;
  setOpen: (arg) => void;
  parameterKeys: Map<string, DropdownItemProps[]>;
  Logo: any;
};
const Parameters = ({ open, setOpen, parameterKeys, Logo }: ParametersType) => {
  const [parameterValues, setParameterValues] = useContext(ParametersContext);

  useEffect(() => {
    if (parameterValues.size === 0) {
      // Try to load from local storage
      const savedParameters = new Map();
      parameterKeys.forEach((_value, key) => {
        const value = localStorage.getItem(key);
        if (value) {
          savedParameters.set(key, value);
        }
      });
      if (savedParameters.size < parameterKeys.size) {
        // If parameters are missing, open the parameter popup to force user to set them
        setOpen(true);
      }
      setParameterValues(new Map(savedParameters));
    }
  }, [parameterKeys]);

  const [errorMessage, setErrorMessage] = useState(undefined);

  const onValidate = () => {
    let allFieldsOk = true;
    parameterKeys.forEach((_value, parameterKey) => {
      if (parameterValues.get(parameterKey) === null || parameterValues.get(parameterKey) === undefined) {
        setErrorMessage('Vous devez remplir tous les champs.');
        allFieldsOk = false;
      }
    });
    if (allFieldsOk) {
      setParameterValues(parameterValues);
      parameterKeys.forEach((_value, parameterKey) => localStorage.setItem(parameterKey, parameterValues.get(parameterKey)));
      setOpen(false);
    }
  };

  const onChange = (parameterKey, value) => {
    setParameterValues(prevMap => {
      const newMap = new Map(prevMap);
      newMap.set(parameterKey, value);
      return newMap;
    });
  };

  const parameters = [];
  parameterKeys.forEach((parameterOptions, parameterKey, index) => {
    let input;
    const value = parameterValues.get(parameterKey);

    if (!parameterOptions) {
      input = (
        <input
          id={`param-${index}`}
          type="text"
          placeholder={parameterKey}
          onChange={event => onChange(parameterKey, event.target.value)}
          value={value || ''}
        />
      );
    } else {
      input = (
        <Select
          compact
          options={parameterOptions}
          onChange={(_event, { value: val }) => onChange(parameterKey, val)}
          value={value}
        />
      );
    }
    parameters.push(
      // eslint-disable-next-line react/no-array-index-key
      <Form.Field key={parameterKey}>
        <label>{parameterKey}</label>
        { input}
      </Form.Field>,
    );
  });

  const errorDiv = errorMessage ? (
    <div className="ui message negative" style={{ display: 'flex', marginTop: '0' }}>
      <i className="times circle outline icon" />
      <div className="content">
        <div className="header">{errorMessage}</div>
      </div>
    </div>
  ) : '';

  return (
    <Modal
      open={open}
      closeOnEscape={false}
      closeOnDimmerClick={false}
    >
      <Modal.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Paramètres généraux</span>
        <Logo />
      </Modal.Header>
      <Modal.Content>
        <Form>
          {parameters}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        {errorDiv}
        <Button
          onClick={onValidate}
          positive
          labelPosition="right"
          icon="checkmark"
          content="Valider"
        />
      </Modal.Actions>
    </Modal>
  );
};

Parameters.propTypes = {
  parameterKeys: instanceOf(Map).isRequired, // Map
  Logo: func,
  setOpen: func.isRequired,
  open: bool.isRequired,
};

export default Parameters;
