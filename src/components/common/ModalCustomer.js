import React,{useEffect} from 'react';
import {Form, InputNumber, Input } from 'antd'
import {DatePicker} from 'antd'
import moment from 'moment'

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

const formatDate = 'DD/MM/YYYY'

const ModalCustomer = ({form, user, handleSubmit}) =>{

    useEffect(()=>{
        form.setFieldsValue({
            name: user?.name || '',
            age: user?.age || '',
            address: user?.address || '',
            birth: user? moment(user.dateOfBirth, formatDate) : moment(new Date().toLocaleDateString('en-GB'), formatDate)
        })
    },[user])

    return(
        <Form 
            form={form} 
            onFinish={handleSubmit} 
            {...layout}
            initialValues= {{'age': 1}}
            validateMessages={validateMessages}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input/>
            </Form.Item>

            <Form.Item name="age" label="Age" rules={[{ type: 'number', min: 0, max: 99, required: true }]}>
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

export default ModalCustomer