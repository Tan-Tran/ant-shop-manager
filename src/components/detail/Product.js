import {Table, Button, Space} from 'antd'

import { useHistory, Switch, Route,useRouteMatch, Link } from 'react-router-dom'

import { DeleteOutlined, EditOutlined, PlusCircleOutlined, LoadingOutlined } from '@ant-design/icons'

import 'antd/dist/antd.css'

import AddProduct from '../pages/AddProduct'

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
    ,{
        title: "Action",
        dataIndex: '',
        key: '',
        render: (record) =>{
            return(
                <Space>
                    <Button type="primary"><EditOutlined/></Button>
                    <Button danger><DeleteOutlined/></Button>
                </Space>
            )
        }
    }
]

const Product  = () =>{

    const history = useHistory()

    let {path, url} = useRouteMatch()

    return (
        <>
            
            <div className="add-icon">
                <Button type="primary" onClick = {() =>{
                    history.push(`${url}/add-product`)

                }}><PlusCircleOutlined /></Button>
            </div>
            <Table dataSource={dataSource} columns={columns}/>
            <Switch>
                <Route path={`${path}/add-product`}>
                    <AddProduct/>
                </Route>    
            </Switch>
        </>
        
    )
}
export default Product