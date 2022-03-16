import {Table} from 'antd'

import 'antd/dist/antd.css'

const dataSource= [
    {
        key: 1,
        customerName: 'John 1',
        productName: 'Mouse',
        quantity: 1,
        price: 15,
        total: 15,
    },
    {
        key: 2,
        customerName: 'John 1',
        productName: 'Keyboard',
        quantity: 2,
        price: 10,
        total: 20,
    },
    {
        key: 3,
        customerName: 'John 2',
        productName: 'Screen',
        quantity: 2,
        price: 10,
        total: 20,
    },
    {
        key: 4,
        customerName: 'John 1',
        productName: 'Screen',
        quantity: 3,
        price: 10,
        total: 30,
    },
]

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
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total'
    }
]

const Order = props =>{
    return(
        <Table dataSource={dataSource} columns={columns}/>
    )
}

export default Order