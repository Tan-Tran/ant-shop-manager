import React,{useEffect, useContext} from 'react';
import {Form, InputNumber, Input, Button} from 'antd'
import {DatePicker} from 'antd'
import moment from 'moment'

import formatDate from '../format/formatDate'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };
  
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};


const AddCustomer = props =>{

    const customer = useContext()

    return(
        <Form 
            // form={} 
            // onFinish={} 
            {...layout}
            validateMessages={validateMessages}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input/>
            </Form.Item>

            <Form.Item name="age" label="Age" rules={[{ type: 'number', min: 1, max: 99, required: true }]}>
                <InputNumber/>
            </Form.Item>

            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item name="birth" label="Date of birth" rules={[{ required: true }]}>
                <DatePicker format={formatDate} disabledDate={d => !d || d.isAfter(new Date().toLocaleDateString())}/>
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>

        </Form>
    )
}

export default AddCustomer