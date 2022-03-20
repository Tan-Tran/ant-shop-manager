import React from 'react';
import {Form, Input, Button, InputNumber, Select} from 'antd'

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
    const [form] = Form.useForm()

    const addProductHandler = () =>{

    }

    return(
        <>
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
                    <Select defaultValue="vn" style={{ width: 200 }}>
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