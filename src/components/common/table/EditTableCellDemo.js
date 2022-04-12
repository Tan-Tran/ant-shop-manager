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
  triggerOnChange,
  ...restProps
}) => {
  let childNode = children;
  const Element = inputType;
  if (editable) {
    childNode = editing ? (
      <Form.Item name={[record.key, dataIndex]} {...formItemProps}>
        <Element
          {...elementProps}
          onChange={(value) => triggerOnChange({ key: record.key, value: value, name: dataIndex })}
        />
      </Form.Item>
    ) : (
      <div>{children}</div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;
