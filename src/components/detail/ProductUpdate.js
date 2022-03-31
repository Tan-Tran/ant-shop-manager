import React, {useState, useEffect, useRef, useContext} from 'react';

import {Table, Button, Space, Spin, Form, Input, InputNumber, message} from 'antd'

import { DeleteOutlined, EditOutlined, AppstoreAddOutlined, LoadingOutlined, CheckOutlined, CloseOutlined, PlusCircleOutlined } from '@ant-design/icons'

import 'antd/dist/antd.css'

const loadingIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

const EditableCell = ({editing, dataIndex, title, inputType, record, index, children,...restProps}) => {
        const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
        return (
        <td {...restProps}>
            {editing ? (
            <Form.Item
                name={[record.key, dataIndex]}
                style={{
                margin: 0,
            }}
                rules={[
                    {
                        required: true,
                        message: `Please Input ${title}!`,
                    },
                ]}
            >
                {inputNode}
            </Form.Item>
            ) : (
            children
            )}
        </td>
        );
    };


const Product  = () =>{

    const [form] = Form.useForm()

    const[products, setProducts] = useState([])

    const[isLoading, setIsLoading] = useState(false)

    const[editingKeys, setEditingKeys] = useState([])

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

    const deleteRecord = (key) =>{
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

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', editable: true,},
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', editable: true,},
        { title: "Price", dataIndex: 'price', key: 'price', editable: true,},
        { title: 'Origin', dataIndex: 'origin', key: 'origin', editable: true,},
        { title: 'Description', dataIndex: 'desc', key: 'desc',editable: true,},
        {
            title: "Action",
            dataIndex: '',
            key: '',
            render: (record) =>{
                const editable = isEditing(record)
                return(
                    !record.isNew? 
                    (editable?
                    (<Space>
                        <Button type="primary" htmlType="submit"><CheckOutlined/></Button>
                        <Button danger onClick={() => cancelUpdateRecord(record.key)}><CloseOutlined/></Button>
                    </Space>):
                    (<Space>
                        <Button type="primary" onClick={() => {editRecord(record)}}><EditOutlined/></Button>
                        <Button danger onClick={() => deleteRecord(record.key)}><DeleteOutlined/></Button>
                    </Space>)):(
                        <Space>
                            {/* <Button type="primary" onClick={() => saveRecord(record.key)}><PlusCircleOutlined/></Button> */}
                            <Button danger onClick={() => cancelAddNewRecord(record.key)}><CloseOutlined/></Button>
                        </Space>
                    )
                )
            }
        }
    ]

    const editRecord = (record) =>{
        const key = record.key        
        form.setFieldsValue({
            [`${key}`]:{
                name: record.name,
                quantity: record.quantity,
                price: record.price,
                origin: record.origin,
                desc: record.desc,
            }
        });
        setEditingKeys((previous) =>{
            return[...previous, record.key]
        })
    }

    const isEditing = (record) =>{
        return editingKeys.find((key) => key === record.key)? true: false
    }

    const cancelUpdateRecord = (key) =>{
        setEditingKeys(editingKeys.filter((item) => item !== key))
    }
    
    const cancelAddNewRecord = (key) =>{
        const productsAfterRemoveNewRow = products.filter((item) => item.key !== key)
        setProducts(productsAfterRemoveNewRow)
    }

    const addRowProduct = () =>{
        const key = Date.now()
        const newRowData = {
            key: key,
            name: '',
            price: 1,
            quantity: 1,
            desc:'',
            origin:'',
            isNew: true, 
        }
        setEditingKeys((previous) =>{
            return[...previous, key]
        })
        const newProducts = [...products, {...newRowData}]
        setProducts(newProducts)
    }

    const submitData = (data) =>{
        console.log("abc")
        console.log(data)
    }

    const customColumns = columns.map((column) =>{
        if(!column.editable){
            return column
        }
        return{
            ...column,
            onCell: (record) =>({
                record,
                inputType: (column.dataIndex === 'quantity' ||  column.dataIndex === 'price')? 'number':'text',
                title: column.title,
                dataIndex: column.dataIndex,
                editable: column.editable,
                editing: isEditing(record),
            })
        }
    })
    
    return (
        <>
            {isLoading && <div className="loading">
                <Spin indicator={loadingIcon}/>
            </div>}           
            <div className="add-icon">
                <Button type="primary" onClick={addRowProduct}><AppstoreAddOutlined/></Button>
            </div>
            <Form form={form} validateMessages={validateMessages} onFinish={submitData}>
                <Table
                    pagination={false}
                    dataSource={products}
                    columns={customColumns}
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