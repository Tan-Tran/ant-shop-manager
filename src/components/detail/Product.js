import {Table} from 'antd'

import 'antd/dist/antd.css'

const dataSource = [
    {
        key: 1,
        name: 'Mouse',
        quantity: 20,
        desc: 'new product',
        price: 15,
        origin: 'VN'
    },
    {
        key: 2,
        name: 'Keyboard',
        quantity: 40,
        desc: 'old product',
        price: 10,
        origin: 'US'
    },
    {
        key: 3,
        name: 'Screen',
        quantity: 60,
        desc: 'old product',
        price: 10,
        origin: 'China'
    }
]

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: "Price",
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Origin',
        dataIndex: 'origin',
        key: 'origin'
    },
    {
        title: 'Description',
        dataIndex: 'desc',
        key: 'desc'
    }
]

const Product  = props =>{
    return (
        <Table dataSource={dataSource} columns={columns}/>
    )
}
export default Product