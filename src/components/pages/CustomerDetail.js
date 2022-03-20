import React,{useEffect, useState} from 'react'
import { useHistory } from "react-router-dom"
import {Form, InputNumber, Input, Button, Spin} from 'antd'
import {DatePicker} from 'antd'
import moment from 'moment'

import {
    useParams
} from "react-router-dom";

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

const formatDate = 'DD/MM/YYYY'

const CustomerDetail = () =>{

    const [form] = Form.useForm();

    const {id} = useParams();

    const[customer, setCustomer] = useState({})
    
    const[isLoading, setIsLoading] = useState(true)

    const history = useHistory()

    const url = `https://shop-management-aba6f-default-rtdb.firebaseio.com/customers/${id}.json`

    useEffect(() =>{

        const fetchCustomer = async () =>{
            try{
                const response = await fetch(url);
                const data = await response.json();
                setCustomer(data)
                setIsLoading(false);
            }catch(error){
                console.log(error.message);
                setIsLoading(false);
            }
        }
        fetchCustomer();
    },[])

    useEffect(() =>{
        form.setFieldsValue({
            name: customer?.name || '',
            age: customer?.age || 1,
            address: customer?.address || '',
            birth: customer.dateOfBirth? moment(customer.dateOfBirth, formatDate) : moment(new Date().toLocaleDateString('en-GB'), formatDate)
        })
    },[customer])

    const handleFinish = (values) =>{

        const newData = {
            name: values.name,
            age: values.age,
            address: values.address,
            dateOfBirth: moment(values.birth).format(formatDate)
        }
        
        const updateCustomer = async () =>{
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            })
            history.push("/customer")

            const data = await response.json();
        }
        updateCustomer();
    }
    
    return(
        <React.Fragment>
            {isLoading && <div className="loading">
                <Spin tip="Loading..."></Spin>
            </div>}
            <Form 
                form={form} 
                onFinish={handleFinish} 
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
        </React.Fragment>
    )
}
export default CustomerDetail