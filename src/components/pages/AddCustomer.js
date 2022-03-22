import React,{useState} from 'react';
import { useHistory } from "react-router-dom"
import {Form, InputNumber, Input, Button, Spin} from 'antd'
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


const AddCustomer = () =>{

    const [form]  = Form.useForm()

    const[isSending, setIsSending] = useState(false)

    const history = useHistory()

    const addCustomerHandler = (values) =>{

        const newCustomer = {
            name: values.name,
            age: values.age,
            address: values.address,
            dateOfBirth: moment(values.birth).format(formatDate),
            phone: values.phone
        }

        const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/customers.json"

        const addCustomer = async () =>{
            setIsSending(true)
            try{
                const response = await fetch(url,{
                    method: "POST",
                    body: JSON.stringify(newCustomer),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if(!response.ok){
                    throw new Error("Some thing went wrong!")
                }
                setIsSending(false)
                history.push("/customer")
                const data = await response.json()
            }catch(error){
                setIsSending(false)
                console.log("error")                   
            }
        }
        addCustomer();
    }

    return(
        <>  
            {isSending && <div className="loading">
                <Spin tip="Sending..."></Spin></div>}
            <Form 
                form={form} 
                onFinish={addCustomerHandler} 
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

                <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>

            </Form>
        </>
    )
}

export default AddCustomer