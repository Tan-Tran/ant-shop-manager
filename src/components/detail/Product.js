import React, {useState, useEffect} from 'react';

import {Table, Button, Space, Spin} from 'antd'

import { useHistory, Switch, Route,useRouteMatch, Link } from 'react-router-dom'

import { DeleteOutlined, EditOutlined, PlusCircleOutlined, LoadingOutlined } from '@ant-design/icons'

import {
    useParams
} from "react-router-dom";

import 'antd/dist/antd.css'

import AddProduct from '../pages/AddProduct'

const loadingIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />

const Product  = () =>{

    const history = useHistory()

    const[products, setProducts] = useState([])

    const[isLoading, setIsLoading] = useState(false)

    const columns = [
        {title: 'Name', dataIndex: 'name', key: 'name'},
        {title: 'Quantity', dataIndex: 'quantity', key: 'quantity'},
        {title: "Price", dataIndex: 'price',key: 'price'},
        {title: 'Origin', dataIndex: 'origin',key: 'origin'},
        {title: 'Description',dataIndex: 'desc',key: 'desc'},
        {
            title: "Action",
            dataIndex: '',
            key: '',
            render: (record) =>{
                return(
                    <Space>
                        <Button type="primary" onClick={() =>{
                            history.push(`product/${record.key}`)
                        }}><EditOutlined/></Button>
                        <Button danger onClick={() => handleDelete(record.key)}><DeleteOutlined/></Button>
                    </Space>
                )
            }
        }
    ]

    
    const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json"

    const fetchProducts = async() =>{
        setIsLoading(true)
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
            setIsLoading(false)
        }catch(error){
            setIsLoading(false)
            console.log("Add product failed")
        }

    }

    useEffect(() =>{
        fetchProducts()
    },[])

    const handleDelete =  (key) =>{
        const url = `https://shop-management-aba6f-default-rtdb.firebaseio.com/products/${key}.json`

        const removeProduct = async() =>{
            try{
                const response = await fetch(url, {
                    method: 'DELETE',
                });
                const newProducts = products.filter((product) => product.key !== key)
                setProducts(newProducts)
            }catch(error){
                console.log("delete error")
            }
        }
        removeProduct();
    }


    return (
        <>
            {isLoading && <div className="loading">
                    <Spin indicator={loadingIcon}></Spin>
             </div>}           
            <div className="add-icon">
                <Button type="primary" onClick = {() =>{
                    history.push("/add-product")

                }}><PlusCircleOutlined /></Button>
            </div>
            <Table dataSource={products} columns={columns}/>
        </>
        
    )
}
export default Product