import React, { useState } from 'react';
import {Modal, Form, Button, Input } from 'antd'
import {DatePicker} from 'antd'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  
  /* eslint-disable no-template-curly-in-string */
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

const UpdateCustomer = props =>{

    const [form] = Form.useForm()

    const[isVisible, setIsVisible] = useState(false)

    const showModal = () =>{
        setIsVisible(true)
    }

    const handleCancel = () =>{
        setIsVisible(false)
    }

    const handleSubmit = (values) =>{
        console.log(values)
    }



    

    return (
        <>  
            <Button type="primary" onClick={showModal}>+Add new customer</Button>
            <Modal title="Add Customer" visible={isVisible} onOk={form.submit} onCancel={handleCancel}>
            <Form form={form} onFinish={handleSubmit}>
                <Form.Item>
                    <Input/>
                </Form.Item>
            </Form>
            </Modal>
        </>
    )
}

export default UpdateCustomer