import React,{useEffect, useState} from 'react';

import {Form, Input, Button, InputNumber, Select, Spin} from 'antd'

import {useHistory, useParams} from 'react-router-dom'

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

const EditProduct = () =>{

    const [form] = Form.useForm();

    const {id} = useParams();

    const[isLoading, setIsLoading] = useState(false)

    const[product, setProduct] = useState({})
    
    const history = useHistory()

    const url = `https://shop-management-aba6f-default-rtdb.firebaseio.com/products/${id}.json`

    useEffect(() =>{
        const fetchProduct = async () =>{
            setIsLoading(true)
            try{
                const response = await fetch(url)
                const data = await response.json();
                setProduct(data)
                setIsLoading(false)
            }catch(error){
                console.log("get product error")
            }         
        }
        fetchProduct();
    },[])

    useEffect(() =>{
        form.setFieldsValue({
            name: product?.name || '',
            quantity: product?.quantity || 0,
            price: product?.price || 0,
            origin: product?.origin || '',
            desc: product?.desc || '',
        })
    },[product])

    const updateProductHandler = (values) =>{

        const newData = {
            name: values.name,
            price: values.price,
            origin: values.origin,
            address: values.address,
            quantity: values.quantity,
            desc: values.desc,
        }

        const updateProduct = async () =>{
            const response = await fetch(url,{
                method: 'PUT',
                headers: { 'Content-Type': 'application'},
                body: JSON.stringify(newData)
            })
            history.push("/product")
        }

        updateProduct()

    }

    return(
        <>
            {isLoading && <div className="loading">
                <Spin tip="Loading..."></Spin>
            </div>}
            <Form 
                form={form} 
                onFinish={updateProductHandler} 
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

export default EditProduct