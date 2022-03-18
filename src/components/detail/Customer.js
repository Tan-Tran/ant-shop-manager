import React, { useState, createContext } from 'react';
import {Table, Button, Space} from 'antd'
import ModalCustomer from '../common/modal/ModalCustomer'
import { useHistory } from "react-router-dom";



import 'antd/dist/antd.css'
import { ConsoleSqlOutlined } from '@ant-design/icons';

const dataSource = [
    {
        key: '0',
        name: 'John 1',
        age: 22,
        address: 'New York',
        dateOfBirth: '1/1/2000',
    },
    {
        key: '1',
        name: 'John 2',
        age: 21,
        address: 'HCM',
        dateOfBirth: '1/1/2001',
    },
    {
        key: '2',
        name: 'John 3',
        age: 20,
        address: 'Ha Noi',
        dateOfBirth: '1/1/2002',
    },
]



const Customer = props =>{

    const[data, setData] = useState(dataSource)
    const[numberOfCustomer, setNumberOfCustomer] = useState(dataSource.length)
    const history = useHistory()

    const handleUpdate = (record) =>{
        const newData = [...data]
        const index = newData.findIndex(item => record.key === item.key)
        const item = newData[index]
        newData.splice(index, 1, {
            ...item,
            ...record
        })
        setData(newData)
    }

    const handleAdd = (values) =>{
        const newCustomer ={
            key: numberOfCustomer,
            name: values.name,
            age: values.age,
            address: values.address,
            dateOfBirth: values.dateOfBirth,
        }
        const dataSource = [...data, newCustomer];
        setData(dataSource)
        setNumberOfCustomer(numberOfCustomer + 1)

    }

    const handleDelete = (key) =>{
        const dataSource = [...data]
        const dataAfterDelete = dataSource.filter((item) => item.key !== key)
        setData(dataAfterDelete)
    }
    
    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { title: 'Date of birth', dataIndex: 'dateOfBirth', key: 'dateOfBirth' },
        {
          title: 'Action',
          dataIndex: '',
          key: '',
          render: (_, record) => {
              return(
                  <Space>
                    {/* <ModalCustomer 
                        descBtn={"Update"} 
                        type={"primary"} 
                        customer={record} 
                        handleSubmit={handleUpdate}
                    /> */}
                    <Button type="primary" onClick={() =>{
                        history.push(`/customer/${record.key}`)
                    }}>Update</Button>
                    <Button danger onClick={() => handleDelete(record.key)}>Delete</Button>
                  </Space>
              )
          }
        },
      ];
    
    return (
        <>
            <div style={{float:'right'}}>
                <ModalCustomer 
                    descBtn={"Add customer"} 
                    type={"primary"} 
                    handleSubmit={handleAdd}
                />
                {/* <Button type="primary" onClick = {() =>{history.push("/add-customer")}}>
                    Add customer
                </Button> */}
            </div>
            <Table dataSource={data} bordered columns={columns}/>
        </>
    )
}

export default Customer