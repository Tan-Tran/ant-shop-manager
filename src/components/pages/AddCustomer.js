import React, { useState } from 'react';
import {Modal, Form, Button, Input, InputNumber } from 'antd'
import {DatePicker} from 'antd'

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

const AddCustomer = ({handleAdd}) =>{

    const [form] = Form.useForm()

    const[isVisible, setIsVisible] = useState(false)

    const showModal = () =>{
        setIsVisible(true)
    }

    const handleCancel = () =>{
        setIsVisible(false)
    }

    const handleSubmit = (values) =>{
        handleAdd(values)
        form.resetFields();
        setIsVisible(false)
    }


    return (
        <>  
            <Button type="primary" onClick={showModal}>+Add new customer</Button>
            <Modal title="Add Customer" visible={isVisible} onOk={form.submit} okText="Save" onCancel={handleCancel}>
                <Form form={form} onFinish={handleSubmit} {...layout} validateMessages={validateMessages}>
                    <Form.Item name={['user', 'name']} label="Name" rules={[{ required: true }]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={['user', 'age']} label="Age" rules={[{ type: 'number', min: 0, max: 99 }]}>
                        <InputNumber/>
                    </Form.Item>
                    <Form.Item name={['user', 'address']} label="Address" rules={[{ required: true }]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={['user','birth']} label="Date of birth" rules={[{ required: true }]}>
                        <DatePicker formatDate={formatDate}/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default AddCustomer