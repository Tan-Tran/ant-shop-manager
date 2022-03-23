import React,{useEffect, useState} from 'react';
import {Form, Select, InputNumber, Button, Row, Col, Table, Card, Space} from 'antd'
import {PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'

const layout = {
    labelCol: { span: 6 },
    wrapperCol: {span: 16, }
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

    const[customer, setCustomer] = useState({})

    const[total, setTotal] = useState(0)

    const[items, setItems] = useState([])

    useEffect(() =>{
        form.setFieldsValue({
            quantity: 1
        })
    },[])

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
        const quantity = +form.getFieldValue("quantity")
        let newItems = [...items]
        if(productId){
            const product = products.find(p => p.key === productId)
            const currentProduct  = items.find((item) => item.key === productId)
            if(currentProduct){
                newItems = items.map((item) => item.key === productId? {
                    ...item,
                    quantity: item.quantity + quantity,
                    total: item.total + quantity * item.price,
                }: item)
            }else{
                newItems.push({
                    key: product.key,
                    product: product.name,
                    quantity: quantity,
                    price: product.price,
                    total: (quantity)* (+product.price)
                })
            }
        }

        const total = newItems.reduce((previous, current) => (previous? previous.total: 0) + (+current.total), 0)
        setItems(newItems);
        setTotal(total)
    }

    const addCurrentProduct = (key) =>{
        let newItems = [...items]
        newItems = items.map((item) => item.key === key? {
            ...item,
            quantity: item.quantity + 1,
            total: item.total + item.price,
        }: item)
        setItems(newItems);
        const total = newItems.reduce((previous, current) => (previous? previous.total: 0) + (+current.total), 0)
        setTotal(total)
    }

    const decreaseCurrentProduct = (key) =>{
        let newItems = [...items]
        const currentItem = items.find((item) => item.key === key)
        if(currentItem?.quantity === 1){
            newItems = items.filter((item) => item.key !== key)
        }else{
            newItems = items.map((item) => item.key === key? {
                ...item,
                quantity: item.quantity - 1,
                total: item.total - item.price,
            }: item)
        }
        const total = newItems.reduce((previous, current) => (previous? previous.total: 0) + (+current.total), 0)
        setTotal(total)
        setItems(newItems);
    }

    const selectCustomerHandler = (values) =>{
        setCustomer(customers.find((item) => item.key === values))
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
                    <Space>
                        <Button type="primary" onClick={() => addCurrentProduct(record.key)}><PlusCircleOutlined/></Button>
                        <Button danger onClick={() => decreaseCurrentProduct(record.key)}><MinusCircleOutlined/></Button>
                    </Space>
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
                    <Col span={12}>
                        <Row>
                            <Form.Item name="customerId" label="Search" rules={[{ required: true }]}>
                                <Select
                                    showSearch
                                    style={{ width: 225}}
                                    placeholder="Search customer"
                                    optionFilterProp="children"
                                    onChange={selectCustomerHandler}
                                    filterOption={(input, option) => 
                                        option.children.props.children[0].props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    filterSort={(optionA, optionB) =>
                                        optionA.children.props.children[0].props.children[1].toLowerCase().localeCompare(optionB.children.props.children[0].props.children[1].toLowerCase())
                                    }
                                >
                                    {customers.map((customer) =>{
                                        return(
                                            <Option value={customer.key} key={customer.key}>
                                                <div>
                                                    <span style={{display: 'inline-block', marginLeft: 10, width: 100}}>
                                                        Name: {customer.name}
                                                    </span>
                                                    <span style={{display: 'inline-block', marginLeft: 10, width: 150}}>
                                                        Phone: {customer.phone}
                                                    </span>
                                                    <span style={{display: 'inline-block',  marginLeft: 10, width: 150}}>
                                                        Birth: {customer.dateOfBirth}
                                                    </span>
                                                    <span style={{display: 'inline-block',  marginLeft: 10, width: 100}}>
                                                        Address: {customer.address}
                                                    </span>
                                                </div>
                                            </Option>
                                        )
                                    })}
                            
                                </Select>
                            </Form.Item>
                        </Row>
                        <Row>
                        <Card title="Customer" bordered={false} style={{ width: 300 }}>
                            <p>Name: {customer.name}</p>
                            <p>ID: {customer.key}</p>
                            <p>Phone: {customer.phone}</p>
                            <p>Birth: {customer.dateOfBirth}</p>
                        </Card>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="product" label="Product" rules={[{ required: true }]}>
                            <Select style={{ width: 200 }} placeholder="select product">
                                {products.map((product) =>{
                                    return (
                                        <Option key={product.key} value={product.key}>{product.name}</Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item name="quantity" label="Quantity" rules={[{ type: 'number', min: 1, required: true }]}>
                            <InputNumber min={1}/>
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 6,
                                span: 18,
                            }}
                        >

                            <Button type="primary"
                                onClick = {() =>{
                                    handleAddProduct()
                                }}
                            ><PlusCircleOutlined/>Add product</Button>
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 6,
                                span: 18,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Complete
                            </Button>
                        </Form.Item>

                    </Col>
                </Row>
            </Form>
            <br/>
            <Row>
                <h4>List items</h4>
            </Row>
            <Table columns={columnsProduct} dataSource={items}></Table>
            <Row>
                <h4>Total: {total}</h4>
            </Row>
        </>
    )
}

export default AddOrder