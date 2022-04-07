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
  restProps,
  ...restPropsCell
}) => {
  let childNode = children;

  if (editable) {
    const { rules, style } = restProps;
    childNode = editing ? (
      <Form.Item
        name={[record.key, dataIndex]}
        rules={rules}
        style={style}
        {...restPropsCell}
      >
        {inputType}
      </Form.Item>
    ) : (
      <div>{children}</div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;
