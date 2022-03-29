import React, {useEffect, useState} from 'react';

import {Table, Button, Space, Tag} from 'antd'

import { DeleteOutlined, EditOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'

import 'antd/dist/antd.css'

import {useHistory} from 'react-router-dom'

const Order = () =>{

    const history = useHistory()

    const[products, setProducts] = useState([])

    const[customers, setCustomers] = useState([])

    const[orders, setOrders] = useState([])

    const[dataOrders, setDataOrders] = useState([])

    const fetchProducts = async() =>{
        const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json"
        try{
            const response = await fetch(url)
            if(!response.ok){
                throw new Error("Some thing went wrong!")
            }
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
        }catch(error){
            console.log("Add product failed")
        }
    }

    const fetchCustomers = async () =>{
        const response = await fetch("https://shop-management-aba6f-default-rtdb.firebaseio.com/customers.json")
        const data = await response.json()
        const loadedCustomers = [];
        for(const key in data){
            loadedCustomers.push({
                key: key,
                name: data[key].name,
                age: data[key].age,
                address: data[key].address,
                dateOfBirth: data[key].dateOfBirth,
                phone: data[key].phone
            })
        }
        setCustomers(loadedCustomers)
    }

    const fetchOrders = async () =>{
        const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/orders.json"
        const response =  await fetch(url)
        const data = await response.json()
        const loadedOrders = []
        for(const key in data){
            loadedOrders.push({
                key: key,
                customerId: data[key].customerId,
                products: data[key].products
            })
        }
        setOrders(loadedOrders)       
    }

    useEffect(()=>{
        fetchCustomers()
        fetchOrders()
        fetchProducts()
    },[])

    useEffect(()=>{
        if(customers.length !== 0 && orders.length !== 0){
            const data = []
            for(const order of orders){
                const orderId = order.key
                const customer = customers.find((item) => item.key === order.customerId)
                const orderData = {
                    key: orderId,
                    customerName: customer?.name,
                    productName: [],
                    quantity: 0,
                    total: 0,
                }
                for(const product of order.products){                    
                    orderData.productName.push(product.product)
                    orderData.quantity = orderData.quantity + product.quantity
                    orderData.total = orderData.total + product.total
                }
                data.push(orderData)
            }
            setDataOrders(data)
        }
    },[customers, orders])

    const expandedRowRender = (row) => { 
        const orderId = row.key
        const order = orders.find((order)=> order.key === orderId)
        const loadedProducts = []
        const data = order.products
        for(const item of data){
            const product = products.find((product)=> product.key === item.key)
            loadedProducts.push({
                key: item.key,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                desc: product.desc,
                origin: product.origin,
            })
        }
        const columns = [
            { title: 'Product', dataIndex: 'name', key: 'name', editable: true,},
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', editable: true,},
            { title: "Price", dataIndex: 'price', key: 'price', editable: true,},
            { title: 'Origin', dataIndex: 'origin', key: 'origin', editable: true,},
            { title: 'Description', dataIndex: 'desc', key: 'desc', editable: true,},
            {
                title: 'Action',
                dataIndex: '',
                key: '',
                render: (record) =>{
                    return (
                        <Space>
                            <Button type="primary" shape="circle" ghost><PlusCircleOutlined/></Button>
                            <Button danger shape="circle"><MinusCircleOutlined/></Button>
                        </Space>
                    )
                }
            }
        ]
        return <Table className="sub-table" columns={columns} dataSource={loadedProducts} pagination={false} />;
    }
    
    const columns = [
        { title: 'Customer', dataIndex: 'customerName', key: 'customerName', editable: true,},
        { 
            title: 'Product', 
            dataIndex: 'productName', 
            key: 'productName',
            render: (productNames) =>(
                <>
                    {productNames.map((productName) =>{
                        return(
                            <Tag name="productName"color="geekblue" key={productName}>
                                {productName.toUpperCase()}
                            </Tag>
                        )
                    })}
                </>
            )
        },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', editable: true,},
        { title: 'Total', dataIndex: 'total', key: 'total', editable: false,},
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (record) =>{
                return (
                    <Space>
                        <Button type="primary"><EditOutlined/></Button>
                        <Button danger><DeleteOutlined/></Button>
                    </Space>
                )
            }
        }        
    ]

    const addNewOrder = () =>{
        console.log("abc")
    }

    return(
        <>
            <div className="add-icon">
                <Button type="primary" onClick = {() => history.push("/add-order")}><PlusCircleOutlined/></Button>
            </div>
            <Table
                className="components-table-demo-nested"
                expandable={{ expandedRowRender }}
                dataSource={dataOrders} 
                columns={columns}
            />
        </>
    )
}

export default Order