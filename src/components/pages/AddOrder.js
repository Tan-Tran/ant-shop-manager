import React,{useEffect, useState} from 'react';
import {Form, Select, InputNumber, Button, Row, Col, Table} from 'antd'
import {PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'

const layout = {
    labelCol: { span: 6 },
  };;

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

const {Option} = Select

const AddOrder = () =>{
    const [form] = Form.useForm()

    const[products, setProducts] = useState([])

    const[customers, setCustomers] = useState([])

    const[items, setItems] = useState([])

    const submitHandler = (values) =>{

        const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/orders.json"

        const newOrder = {
            customerId: values.customerId,
            products: items
        }


        const addOrder = async() =>{
            const response =  fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            })
            const data = response.json()
            console.log(data)
        }
        addOrder()

    }

    const handleAddProduct = () =>{
        const productId = form.getFieldValue("product")
        const quantity = form.getFieldValue("quantity")
        let newItems = [...items]
        if(productId){
            const product = products.find(p => p.key === productId)
            const currentProduct  = items.find((item) => item.key === productId)
            if(currentProduct){
                newItems = items.map((item) => item.key === productId? {
                    ...item,
                    quantity: item.quantity + quantity,
                    total: item.total + item.price,
                }: item)
            }else{
                newItems.push({
                    key: product.key,
                    product: product.name,
                    quantity: 1,
                    price: product.price,
                    total: (+quantity)* (+product.price)
                })
            }
        }
        setItems(newItems);
    }

    const addCurrentProduct = (key) =>{
        let newItems = [...items]
        newItems = items.map((item) => item.key === key? {
            ...item,
            quantity: item.quantity + 1,
            total: item.total + item.price,
        }: item)
        setItems(newItems);
    }

    const decreaseCurrentProduct = (key) =>{
        let newItems = [...items]
        newItems = items.map((item) => item.key === key? {
            ...item,
            quantity: item.quantity - 1,
            total: item.total - item.price,
        }: item)
        setItems(newItems);
    }

    const columnsProduct = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product'
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: "Price",
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total'
        },
        {
            title: 'Action',
            dataIndex: '',
            key : '',
            render: (record) =>{
                return(
                    <>
                        <Button type="primary" onClick={() => addCurrentProduct(record.key)}><PlusCircleOutlined/></Button>
                        <Button danger onClick={() => decreaseCurrentProduct(record.key)}><MinusCircleOutlined/></Button>
                    </>
                )
            }
        }
    ]

    useEffect(() =>{
        const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json"
        const fetchProduct = async () =>{
            const response = await fetch(url)
            const data = await response.json()
            const loadedProducts = []
            for(const key in data){
                loadedProducts.push({
                    key: key,
                    name: data[key].name,
                    price: data[key].price,
                    quantity: data[key].quantity,
                    desc: data[key].desc,
                    origin: data[key].origin,
                })
            }
            setProducts(loadedProducts)
        }
        fetchProduct()
    },[])

    useEffect(() =>{
        const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/customers.json"

        const fetchCustomers = async () =>{
            const response = await fetch(url)
            const data = await response.json()
            const loadedCustomers = [];
            for(const key in data){
                loadedCustomers.push({
                    key: key,
                    name: data[key].name,
                    address: data[key].address,
                    dateOfBirth: data[key].dateOfBirth,
                    phone: data[key].phone
                })
            }
            setCustomers(loadedCustomers)
        }
        fetchCustomers()
    },[])

    return(
        <>
            <Form form={form} onFinish={submitHandler}validateMessages={validateMessages} {...layout}> 
                <Row>
                    <Col span={8}>
                        <Row>
                            <Select
                                showSearch
                                style={{ width: 200}}
                                placeholder="Search customer"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                }
                            >
                                {customers.map((customer) =>{
                                    return(
                                        <Option value={customer.key} key={customer.key}>
                                            {customer.key}
                                        </Option>
                                    )
                                })}
                                
                            </Select>
                        </Row>
                        <Row>
                            <span>Description customer</span>
                        </Row>
                    </Col>
                    <Col span={16}>
                        <Form.Item name="product" label="Product" rules={[{ required: true }]}>
                            <Select style={{ width: 200 }} placeholder="select product">
                                {products.map((product) =>{
                                    return (
                                        <Option key={product.key} value={product.key}>{product.name}</Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Form.Item name="quantity" label="Quantity" rules={[{ type: 'number', min: 1, required: true }]}>
                                <InputNumber/>
                            </Form.Item>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary"
                                onClick = {() =>{
                                    handleAddProduct()
                                }}
                            ><PlusCircleOutlined/>Add product</Button>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Complete
                            </Button>
                        </Form.Item>

                    </Col>
                </Row>
            </Form>
            <Row>
                <h4>List items</h4>
            </Row>
            <Table columns={columnsProduct} dataSource={items}></Table>
        </>
    )
}

export default AddOrder