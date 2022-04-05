import React from 'react';

import { Form, Input, InputNumber, Select, DatePicker } from 'antd';

import formatDate from '../../format/formatDate';

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
  isDuplicate,
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
    case 'date':
      inputNode = (
        <DatePicker format={formatDate}/>
      )
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
          width: 150,
        }}
        name={[record.key, dataIndex]}
        rules={[
          {
            required: true,
            message: `${title} is required.`,

          },
          
          ({getFieldValue}) => ({validator(){
            if(inputType === "select" && isDuplicate(getFieldValue([record.key, dataIndex]))){
              return Promise.reject(new Error("Duplicate item"))
            }
            return Promise.resolve()
          }})
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
