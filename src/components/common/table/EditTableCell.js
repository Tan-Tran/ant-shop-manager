import React from 'react';

import {Form, Input, InputNumber, DatePicker, Select} from 'antd'

const {Option} = Select

const EditableCell = ({editing, editable, dataIndex, title, inputType, record, index, children,...restProps}) => {

    let inputNode = ''

    switch(inputType) {
        case 'number':
            inputNode = <InputNumber />
            break
        case 'text':
            inputNode = <Input/>
            break
        case 'select':
            inputNode = <Select placeholder="select item"/>
            break
        default:
            inputNode = <Input/>
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

export default EditableCell
