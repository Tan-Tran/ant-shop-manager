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
  onEdit,
  ...restProps
}) => {
  let childNode = children;
  const Element = inputType;
    if (editable) {
      childNode = editing ? (
        <Form.Item name={[record.key, dataIndex]} {...formItemProps}>
          <Element {...elementProps}
            onChange = {(value) => onEdit? onEdit(record.key):''}
          />
        </Form.Item>
      ) : (
        <div>{children}</div>
      );
    }
  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;
