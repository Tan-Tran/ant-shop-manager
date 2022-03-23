import React, {useEffect, useState} from 'react';

import {Table, Button, Space} from 'antd'

import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'

import {useHistory} from 'react-router-dom'

import 'antd/dist/antd.css'

const Order = () =>{

    const[customers, setCustomers] = useState([])

    const[orders, setOrders] = useState([])

    const[dataOrders, setDataOrders] = useState([])

    const history = useHistory()

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

    useEffect(() =>{
        fetchCustomers()
    },[])

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
        fetchOrders()
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
                    productName: '',
                    quantity: 0,
                    total: 0,
                }
                for(const product of order.products){
                    orderData.productName = orderData.productName + ' ' + product.product
                    orderData.quantity = orderData.quantity + product.quantity
                    orderData.total = orderData.total + product.total
                }
                data.push(orderData)
            }
            setDataOrders(data)
        }
    },[customers, orders])
    
   

    const columns = [
        {
            title: 'Customer',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Product',
            dataIndex: 'productName',
            key: 'productName'
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total'
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (record) =>{
                return (
                    <Space>
                        <Button type="primary"
                            onClick={() => history.push(`/order/${record.key}`)}
                        key={record.key}><EditOutlined/></Button>
                        <Button danger><DeleteOutlined/></Button>
                    </Space>
                )
            }
        }
    ]

    return(
        <>
            <div className="add-icon">
                <Button type="primary" onClick = {() =>{
                    history.push("/add-order")
                }}><PlusCircleOutlined/></Button>
            </div>
            <Table dataSource={dataOrders} columns={columns}/>
        </>
    )
}

export default Order