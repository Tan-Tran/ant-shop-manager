import React from 'react';

import { Form, Input, InputNumber, Select } from 'antd';

const { Option } = Select;

const EditableCell = ({
  editing,
  editable,
  dataIndex,
  title,
  key,
  inputType,
  record,
  index,
  children,
  dataSelect,
  getData,
  ...restProps
}) => {
  let inputNode = '';

  switch (inputType) {
    case 'number':
      inputNode = (
        <InputNumber
          min={1}
          onChange={(value) => getData({ dataIndex, value, key: record.key })}
        />
      );
      break;
    case 'text':
      inputNode = (
        <Input
          onChange={(event) => getData({ dataIndex, event, key: record.key })}
        />
      );
      break;
    case 'select':
      const data = dataSelect[dataIndex];
      inputNode = (
        <Select
          placeholder="select item"
          onChange={(value) => getData({ dataIndex, value, key: record.key })}
        >
          {data.map((item) => {
            return (
              <Option key={item.key} value={item.key}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      );
      break;
    default:
      inputNode = (
        <Input onChange={(event) => getData({ dataIndex, event, key })} />
      );
  }

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={[record.key, dataIndex]}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        {inputNode}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;
