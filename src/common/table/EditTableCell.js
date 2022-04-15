import React from 'react';
import { Form } from 'antd';

const EditableCell = ({
  form,
  record,
  editable,
  inputType,
  dataIndex,
  title,
  editing,
  children,
  formItemProps,
  elementProps,
  onChange,
  ...restProps
}) => {
  let childNode = children;
  const Element = inputType;
  if (editable) {
    childNode = editing ? (
      <Form.Item name={[record.key, dataIndex]} {...formItemProps}>
        <Element
          {...elementProps}
          onChange={() => onChange(record.key)}
        />
      </Form.Item>
    ) : (
      <div>{children}</div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;
