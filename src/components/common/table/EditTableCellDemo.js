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
    restColumn,
    ...restProps
}) => {
    let childNode = children;

    if (editable) {        
        childNode = editing ? (
            <Form.Item 
                name={[record.key, dataIndex]}
            {...restProps}
            {...restColumn}
            >
            {inputType}
            </Form.Item>
        ) : (
            <div>
            {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;
