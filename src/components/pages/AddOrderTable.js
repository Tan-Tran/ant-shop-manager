import React,{useEffect, useState} from 'react';
import {Form, Select, InputNumber, Input, Button, Row, Col, Table, Card, Space, message} from 'antd'
import {PlusCircleOutlined, AppstoreAddOutlined, DeleteOutlined} from '@ant-design/icons'

import validateMessages from '../common/form/ValidateMessages';

const {Option} = Select

const AddOrderTable = () =>{

    const [form] = Form.useForm()

    const [products, setProducts] = useState([])

    const [customers, setCustomers] = useState([])

    const [customer, setCustomer] = useState({})

    const [total, setTotal] = useState(0)

    const [items, setItems] = useState([])

    const [tempItems, setTempItems] = useState([])

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

    const addCurrentProduct = async (key) =>{
        try{
            await form.validateFields()
            let itemIndex = tempItems.findIndex((item) => item.key === key)
            const copyTempItems = [...tempItems]
            copyTempItems[itemIndex].isNew = false
            let total = 0
            for(const item of copyTempItems){
                if(!item.isNew){
                    total = total + item.total
                }           
            }
            setTotal(total)
            setTempItems(copyTempItems)
        }catch(error){
            console.log("empty input")
        }
    }

    const decreaseCurrentProduct = (key) =>{
        let newItems = [...tempItems].filter((item) => item.key !== key)
        let total = 0
        for(const item of newItems){
            total = total + item.total
        }
        setTotal(total)
        setTempItems(newItems)
    }

    const selectCustomerHandler = (values) =>{
        setCustomer(customers.find((item) => item.key === values))
    }

    const addNewItems = () =>{
        const newItem = {
            key: Date.now(),
            product: '',
            quantity: 1,
            price:  0,
            total: 0,
            desc:'',
            isNew: true
        }
        setTempItems([...tempItems,{...newItem}])
    }

    const selectProductHandler = (record) =>{
        const idProduct = form.getFieldValue([record.key, 'product'])
        const copyTempItems = [...tempItems]
        const currentTempItemsIndex = copyTempItems.findIndex((item) => item.key === record.key)
        const currentProduct = products.find((product) => product.key === idProduct)
        const newTempItems = {
            ...copyTempItems[currentTempItemsIndex],
            product: currentProduct.key,
            price: currentProduct.price,
            total: currentProduct.price * copyTempItems[currentTempItemsIndex].quantity
        }
        copyTempItems[currentTempItemsIndex] = newTempItems
        setTempItems(copyTempItems)
    }

    const changeQuantityHandler = (record) =>{
        const quantity = form.getFieldValue([record.key, 'quantity'])
        const copyTempItems = [...tempItems]
        const currentTempItemsIndex = copyTempItems.findIndex((item) => item.key === record.key)
        const newTempItems = {
            ...copyTempItems[currentTempItemsIndex],
            quantity: quantity,
            total: copyTempItems[currentTempItemsIndex].price * quantity
        }
        copyTempItems[currentTempItemsIndex] = newTempItems
        setTempItems(copyTempItems)
    }

    const changeDescriptionHandler = (record) =>{
        const description = form.getFieldValue([record.key, 'desc'])
        const copyTempItems = [...tempItems]
        const currentTempItemsIndex = copyTempItems.findIndex((item) => item.key === record.key)
        const newTempItems = {
            ...copyTempItems[currentTempItemsIndex],
            desc: description
        }
        copyTempItems[currentTempItemsIndex] = newTempItems
        setTempItems(copyTempItems)
    }

    const columnsProduct = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            editable: true,
            render: (_,record) => {
                let node  = ''
                record.isNew? (
                    node = <Form.Item name={[record.key, 'product']} rules={[{ required: true }]}>
                        <Select style={{ width: 200 }} placeholder="select product" onChange={() => selectProductHandler(record)}>
                            {products.map((product) =>{
                                return (
                                    <Option key={product.key} value={product.key}>{product.name}</Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                ):(
                    node = products.find((product) => product.key === record.product).name

                )
                return (
                    <>
                        {node}
                    </>
                )            
            }
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity', 
            editable: true,
            render: (_,record) =>{
                let node = ''
                record.isNew? (
                    node =  <Form.Item 
                                name={[record.key, 'quantity']} 
                                rules={[{ type: 'number', min: 1, required: true }]}
                            >
                                <InputNumber min={1} defaultValue={1} onChange={() => changeQuantityHandler(record)}/>
                            </Form.Item>
                ):(
                    node = record.quantity
                )
                return(
                    <>
                        {node}
                    </>
                )
            }
        },
        {title: 'Price',dataIndex: 'price',key: 'price', editable:false,},
        {title: 'Total',dataIndex: 'total',key: 'total', editable:false,},
        {
            title: 'Description', 
            dataIndex:'desc', 
            key:'desc',
            editable: true,
            render:(_,record) =>{
                let node = ''
                record.isNew? (
                    node =  <Form.Item name={[record.key, "desc"]} rules={[{ required: true }]}>
                                <Input onChange={() => changeDescriptionHandler(record)}/>
                            </Form.Item>
                ):(
                    node =  record.desc
                )
                return(
                    <>
                        {node}
                    </>
                )
            }
        },
        {
            title: 'Action',
            dataIndex: '',
            key : '',
            render: (record) =>{
                return(
                    <Space>
                        {record.isNew && <Button type="primary" onClick={() => addCurrentProduct(record.key)}><PlusCircleOutlined/></Button>}
                        <Button danger onClick={() => decreaseCurrentProduct(record.key)}><DeleteOutlined/></Button>
                    </Space>
                )
            }
        }
    ]

    const editAllItems = () =>{
        const copyTempItems = [...tempItems]
        for(const item of copyTempItems){
            item.isNew = true
        }
        setTempItems(copyTempItems)
        setTotal(0)
    }

    const checkoutOrder = async () =>{
        const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/test-orders.json"
        try{
            await form.validateFields()
            const listProducts = tempItems.map((item) =>{
                return{
                    key: item.product,
                    date: new Date(),
                    price: item.price,
                    desc: item.desc,
                    total: item.total,
                }
            })
            const orderData = {
                customerId: customer.key,
                products: listProducts
            }
            const response = await fetch(url,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            })
            message.success("Add order completed")
        }catch(error){
            console.log("Checkout error")
        }
    }

    return(
        <>
            <Form form={form} validateMessages={validateMessages} component={false}> 
                <Row>
                    <Col span={18}>
                        <Row>
                            <Form.Item name="customerId" label="Search" rules={[{ required: true }]}>
                                <Select
                                    showSearch
                                    style={{ width: 225}}
                                    placeholder="Search customer"
                                    optionLabelProp="label"
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
                                            <Option value={customer.key} key={customer.key} label={customer.name}>
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
                        <Row gutter={16}>
                            <Col>
                                <Card title="Customer" bordered={false} style={{ width: 300 }}>
                                    <p>Name: {customer.name}</p>
                                    <p>ID: {customer.key}</p>
                                    <p>Phone: {customer.phone}</p>
                                    <p>Birth: {customer.dateOfBirth}</p>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <h4>Items: {tempItems.length}</h4>                
                </Row>
                <Row>
                    <h4>Total: {total}</h4>                 
                </Row>
                <Table
                    columns = {columnsProduct} 
                    dataSource = {tempItems}
                    pagination = {false}
                >
                </Table>
                <div style={{width: '100%'}}>
                        <Button 
                            style={{width: '100%', color: '#1890ff', backgroundColor: '#cccc', borderColor:'#cccc'}} 
                            type="primary" onClick={addNewItems}>
                            <AppstoreAddOutlined/> Add new record
                        </Button>
                </div>
                <div className="add-icon">
                    {tempItems.length > 0 && <Space>
                        <Button type="primary" onClick={editAllItems}>
                            Edit
                        </Button>
                        <Button type="primary" onClick={checkoutOrder}>
                            Checkout
                        </Button>
                    </Space>}
                </div>
            </Form>
        </>
    )
}

export default AddOrderTable