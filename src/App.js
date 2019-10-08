// @flow
import * as React from 'react';
import { Admin, Resource } from 'react-admin';
import buildGraphQLProvider from 'ra-data-graphql-simple';

import ContractList from './ContractList';

type Props = {
  token?: string,
  uri?: string,
};

export default function App({
  token = process.env.REACT_APP_TOKEN,
  uri = process.env.REACT_APP_URI,
}: Props): React.Node {
  const [dataProvider, setDataProvider] = React.useState(null);
  const onDataProvider = React.useCallback(
    (provider) => setDataProvider(() => provider),
    []
  );
  React.useEffect(
    () => {
      if (dataProvider === null) {
        buildGraphQLProvider({
          clientOptions: {
            uri,
            headers: {
              authorization: token ? `Bearer ${token}` : '',
            },
          },
        }).then(onDataProvider);
      }
    },
    [dataProvider, onDataProvider, token, uri]
  );

  return dataProvider ? (
    <Admin dataProvider={dataProvider}>
      <Resource name="Contract" list={ContractList} />
    </Admin>
  ) : null;
}
