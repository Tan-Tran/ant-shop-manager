import React, { useEffect } from 'react';
import { DatePicker, Form } from 'antd';
import moment from 'moment';
import { FormatDate_DD_MM_YYY } from '../../constant/FormatDate';

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
  useEffect(() =>{
    if(editing && !record.isNew){
      form.setFieldsValue({
        [`${record.key}`]: inputType === DatePicker? {[dataIndex]: moment(record[dataIndex],FormatDate_DD_MM_YYY)}: {[dataIndex]: record[dataIndex]}
      })
    }
  },[editing])
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
