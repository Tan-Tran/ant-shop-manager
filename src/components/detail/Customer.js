import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"

import {Table, Button, Space, Spin} from 'antd'
import { DeleteOutlined, EditOutlined, UserAddOutlined, LoadingOutlined, AppstoreAddOutlined } from '@ant-design/icons'

import 'antd/dist/antd.css'
import './Customer.css'

const loadingIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />

const Customer = () =>{

    const[customers, setCustomers] = useState([])

    const[isLoading, setIsLoading] = useState(false)

    const history = useHistory()

    const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/customers.json"

    const fetchCustomers = async () =>{
        setIsLoading(true)
        try{
            const response = await fetch(url)
            if(!response.ok){
                throw new Error("Some thing went wrong!")
            }
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
        }catch(error){
            console.log("error", error)
        }
        setIsLoading(false)
    }

    useEffect(() =>{
        fetchCustomers();
    },[])   

    const handleDelete = (key) =>{

        const url = `https://shop-management-aba6f-default-rtdb.firebaseio.com/customers/${key}.json`

        const removeCustomer = async() =>{
            try{
                const response = await fetch(url, {
                    method: 'DELETE',
                });
                const data = await response.json()
                fetchCustomers();
                console.log(data);
            }catch(error){
                console.log("delete error")
            }
        }
        removeCustomer();
    }
    
    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { title: 'Date of birth', dataIndex: 'dateOfBirth', key: 'dateOfBirth' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (_, record) => {
                return(
                    <Space>
                        <Button type="primary" onClick={() =>{
                            history.push(`/customer/${record.key}`)
                        }}><EditOutlined /></Button>
                        <Button danger onClick={() => handleDelete(record.key)}><DeleteOutlined/></Button>
                    </Space>
                )
            }
            },
        ];
    
    return (
        <>
            {isLoading && <div className="loading">
                <Spin indicator={loadingIcon}></Spin>
            </div>}
            <div className="add-icon">
                <Button type="primary" onClick = {() =>{history.push("/add-customer")}}>
                    <UserAddOutlined />
                </Button>
            </div>
            <Table dataSource={customers} bordered columns={columns}/>
        </>
    )
}

export default Customer
