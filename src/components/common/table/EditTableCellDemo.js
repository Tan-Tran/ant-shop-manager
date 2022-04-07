import React from 'react';

import { Form } from 'antd';

const EditableCell = ({
  record,
  editable,
  inputType,
  dataIndex,
  title,
  editing,
  children,
  formItemProps,
  elementProps,
  ...restProps
}) => {
  let childNode = children
  const Element = inputType
  if (editable) {
    childNode = editing ? (
      <Form.Item
        name={[record.key, dataIndex]}
        {...formItemProps}
      >
        <Element {...elementProps}/>
      </Form.Item>
    ) : (
      <div>{children}</div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;
