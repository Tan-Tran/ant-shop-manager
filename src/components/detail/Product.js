import React, {useState, useEffect, useRef} from 'react';

import {Table, Button, Space, Spin, Form, Input, InputNumber} from 'antd'

import { DeleteOutlined, EditOutlined, PlusCircleOutlined, LoadingOutlined, CheckOutlined, CloseOutlined, ColumnHeightOutlined } from '@ant-design/icons'

import 'antd/dist/antd.css'

const loadingIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />

const EditRowTable = ({index, ...props}) =>{
    return(
        <>
        </>
    )
}

const EditableCell = ({editing, editable, dataIndex, title, inputType, record, children,...restProps}) =>{
    const inputNode = inputType === 'number'? <InputNumber/>:<Input/>
    const content = editable && editing?
        <Form.Item
            name = {dataIndex}
            style={{width:200}}
            rules={[
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
            ]}
        >
            {inputNode}
        </Form.Item>
        : children
    return(
        <td {...restProps}>
            {content}
        </td>
    )
}


const Product  = () =>{

    const[products, setProducts] = useState([])

    const[isLoading, setIsLoading] = useState(false)

    const [form] = Form.useForm()

    // edit
    const [editingKey, setEditingKey] = useState('');
    

    const isEditing = (record) =>{
        return record.key === editingKey
    }

    const columns = [
        {
            title: 'Name', 
            dataIndex: 'name', 
            key: 'name',
            editable: true,
        },
        {
            title: 'Quantity', 
            dataIndex: 'quantity', 
            key: 'quantity',
            editable: true,
        },
        {
            title: "Price", 
            dataIndex: 'price',
            key: 'price',
            editable: true,
        },
        {
            title: 'Origin', 
            dataIndex: 'origin',
            key: 'origin',
            editable: true,
        },
        {
            title: 'Description',
            dataIndex: 'desc',
            key: 'desc',
            editable: true,
        },
        {
            title: "Action",
            dataIndex: '',
            key: '',
            render: (record) =>{
                const editable = isEditing(record)
                return(
                    editable?
                    (<Space>
                        <Button type="primary" ><CheckOutlined/></Button>
                        <Button danger><CloseOutlined/></Button>
                    </Space>):
                    (<Space>
                        <Button type="primary" onClick={() =>{edit(record)}}><EditOutlined/></Button>
                        <Button danger onClick={() => handleDelete(record.key)}><DeleteOutlined/></Button>
                    </Space>)
                )
            }
        }
    ]

    const edit = (record) =>{
        form.setFieldsValue({
            desc: record?.desc,
            name: record?.name,
            origin: record?.origin,
            price: record?.price,
            quantity: record?.quantity
        })
        setEditingKey(record.key)
    }

    const newColumns = columns.map((column) =>{
        if(!editingKey){
            return column
        }
        return{
            ...column,
            onCell: (record) =>({
                record,
                inputType: column.dataIndex === 'age'? 'number':'text',
                title: column.title,
                dataIndex: column.dataIndex,
                editable: column.editable,
                editing: isEditing(record)
            })
        }
    })

    const fetchProducts = async() =>{
        const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json"
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
                <Button type="primary"><PlusCircleOutlined /></Button>
            </div>
            <Form form={form}>                
                <Table
                    dataSource={products} 
                    columns={newColumns}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                />
            </Form>
        </>
        
    )
}
export default Product