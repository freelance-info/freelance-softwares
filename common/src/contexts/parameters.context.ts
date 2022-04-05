import { createContext } from 'react';

export type ParametersContextType = [parameterValues: Map<string, string>, dispatch: React.Dispatch<any>];

export const ParametersContext = createContext<ParametersContextType>([new Map(), (_arg) => {}]);
