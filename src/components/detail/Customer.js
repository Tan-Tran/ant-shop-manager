import React, { useState } from 'react';
import {Table, Button, Space} from 'antd'
import UpdateCustomer from '../pages/UpdateCustomer';

import 'antd/dist/antd.css'

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

    const handleUpdate = (record) =>{
        console.log(record)
    }



    const handleAdd = () =>{
        // const newCustomerDefault ={
        //     key: numberOfCustomer,
        //     name: 'New Customer',
        //     age: '--',
        //     address: '--',
        //     dateOfBirth: '--/--/----',
        // }
        // const dataSource = [...data, newCustomerDefault];
        // setData(dataSource)
        // setNumberOfCustomer(numberOfCustomer+1)

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
                    <Button type="primary" onClick={() => handleUpdate(record)}>Update</Button>
                    <Button danger onClick={() => handleDelete(record.key)}>Delete</Button>
                  </Space>
              )
          }
        },
      ];
    
    return (
        <>
            <div style={{float:'right'}}>
                <UpdateCustomer/>
            </div>
            <Table dataSource={data} bordered columns={columns}/>
        </>
    )
}

export default Customer