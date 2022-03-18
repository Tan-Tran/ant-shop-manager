import React,{useEffect} from 'react';
import {Form, InputNumber, Input } from 'antd'
import {DatePicker} from 'antd'
import moment from 'moment'
import formatDate from '../../format/formatDate'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
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

const CustomerForm = ({form, customer, handleSave}) =>{

    useEffect(()=>{
        form.setFieldsValue({
            name: customer?.name || '',
            age: customer?.age || 1,
            address: customer?.address || '',
            birth: customer.dateOfBirth? moment(customer.dateOfBirth, formatDate) : moment(new Date().toLocaleDateString('en-GB'), formatDate)
        })
    },[customer])

    return(
        <Form 
            form={form} 
            onFinish={handleSave} 
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

        </Form>
    )
}

export default CustomerForm