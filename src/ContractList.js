// @flow
import * as React from 'react';
import { List, Datagrid, DateField, TextField } from 'react-admin';

export default function ContractList(props) {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source={'name'} />
        <DateField source={'date'} />
      </Datagrid>
    </List>
  );
}
