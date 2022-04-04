import React, {useEffect, useState} from 'react';

import {Table, Button, Space, Tag, Form, Input, Select} from 'antd'

import { DeleteOutlined, EditOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'

import 'antd/dist/antd.css'

import moment from 'moment';

import {useHistory} from 'react-router-dom'

import EditableCell from '../common/table/EditTableCell';

import { productConvert, customerConvert, orderConvert } from '../Adapters/DataConvert';
import InputType from '../common/table/InputType'

import {
    getData,
  } from '../Adapters/FetchData';

const {Option} = Select

const Order = () =>{

    const history = useHistory()

    const[products, setProducts] = useState([])

    const[customers, setCustomers] = useState([])

    const[orders, setOrders] = useState([])

    const[ordersData, setOrdersData] = useState([])

    const [form] = Form.useForm()

    const fetchProducts = async () => {
        const url =
          'https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json';
        setProducts(await getData(url, productConvert));
      };
    
      const fetchCustomers = async () => {
        const url =
          'https://shop-management-aba6f-default-rtdb.firebaseio.com/customers.json';
        setCustomers(await getData(url, customerConvert));
      };

    const fetchOrders = async () =>{
        const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/orders.json"
        setOrders(await getData(url, orderConvert))       
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
                    productNames: [],
                    dateOrder: new Date(order.dateOrder).toLocaleDateString('en-US'),
                    total: 0,
                }
                for(const product of order.products){                    
                    orderData.productNames.push(product.name)
                    orderData.total = orderData.total + product.total
                }
                data.push(orderData)
                console.log(orderData)
            }
            setOrdersData(data)
        }
    },[customers, orders])
   
    const columns = [
        { title: 'Customer', dataIndex: 'customerName', key: 'customerName', editable: false,},
        { 
            title: 'Product', 
            dataIndex: 'productNames', 
            key: 'productNames',
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
        { title: 'Date', dataIndex: 'dateOrder', key: 'dateOrder', editable: false,},
        { title: 'Total', dataIndex: 'total', key: 'total', editable: false,},
        { 
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (_, record) => {
                return(
                    <Button danger>
                        <DeleteOutlined />
                    </Button>
                )
            }
        }
        
    ]

    const[editingKey, setEditingKey] = useState(null)

    const editRecord = (record) =>{
        setEditingKey(record.key)
    }
    
    const isEditing = (record) =>{
        return editingKey === record.key? true: false
    }

    const customColumns = columns.map((column) =>{
        if(!column.editable){
            return column
        }
        return{
            ...column,
            onCell: (record) =>({
                record,
                inputType: InputType(column.dataIndex),
                dataIndex: column.dataIndex,
                title: column.title
            })
        }
    })

    return(
        <>
            <div className="add-icon">
                <Button type="primary" onClick = {() => history.push("/add-order")}><PlusCircleOutlined/></Button>
            </div>
            <Form form={form}>    
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    className="components-table-demo-nested"
                    columns={customColumns}
                    dataSource={ordersData} 
                />
            </Form>
        </>
    )
}

export default Order