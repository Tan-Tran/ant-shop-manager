import React,{useState} from 'react';
import {Form, Input, Button, InputNumber, Select, Spin} from 'antd'
import { useHistory } from 'react-router-dom';
import moment from 'moment';

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

const { Option } = Select;

const AddProduct = () =>{

    const {id} = useParams();

    const [form] = Form.useForm()

    const[isSending, setIsSending] = useState(false)

    const history = useHistory()

    console.log(id);

    const addProductHandler = (values) =>{

        const newProduct = {
            name: values.name,
            age: values.age,
            desc: values.desc,
            price: values.price,
            quantity: values.quantity,
            origin: values.origin,

        }

        const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json"

        const addProduct = async () =>{
            setIsSending(true)
            try{
                const response = await fetch(url,{
                    method: 'POST',
                    body: JSON.stringify(newProduct),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                })
                setIsSending(false)
                history.push("/product")
            }catch(error){
                console.log("add product error")
            }
        }
        addProduct();
    }

    return(
        <>
            {isSending && <div className="loading">
                <Spin tip="Sending..."></Spin></div>}
            <Form 
                form={form} 
                onFinish={addProductHandler} 
                {...layout}
                validateMessages={validateMessages}>
                
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                    <Input/>
                </Form.Item>

                <Form.Item name="quantity" label="Quantity" rules={[{ type: 'number', min:0, required: true }]}>
                    <InputNumber/>
                </Form.Item>

                <Form.Item name="price" label="Price" rules={[{ type: 'number', min:0, required: true }]}>
                    <InputNumber />
                </Form.Item>

                <Form.Item name="origin" label="Origin" rules={[{ required: true }]}>
                    <Select style={{ width: 200 }} placeholder="select your origin">
                        <Option value="vn">Viet Nam</Option>
                        <Option value="usa">USA</Option>
                        <Option value="cn">China</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="desc"
                    label="Description"
                    rules={[{ required: true, message: 'Please input your description' }]}
                >
                    <Input.TextArea showCount maxLength={200} />
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

export default AddProduct