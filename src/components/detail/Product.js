import React, {useState, useEffect, useRef, useContext} from 'react';

import {Table, Button, Space, Spin, Form, Input, InputNumber, message} from 'antd'

import { DeleteOutlined, EditOutlined, AppstoreAddOutlined, LoadingOutlined, CheckOutlined, CloseOutlined, PlusCircleOutlined } from '@ant-design/icons'

import 'antd/dist/antd.css'

import validateMessages from '../common/form/ValidateMessages';
import EditableCell from '../common/table/EditTableCell'
import InputType from '../common/table/InputType';

const Product  = () =>{

    const [form] = Form.useForm()

    const [products, setProducts] = useState([])

    const [editingKeys, setEditingKeys] = useState([])

    const [isSaveAllRecord, setIsSaveAllRecord] = useState(false)

    const fetchProducts = async() =>{
        const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json"
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
        }catch(error){
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
                        <Button type="primary" onClick={() => saveRecord(record.key)}><CheckOutlined/></Button>
                        <Button danger onClick={() => cancelUpdateRecord(record.key)}><CloseOutlined/></Button>
                    </Space>):
                    (<Space>
                        <Button type="primary" onClick={() => {editRecord(record)}}><EditOutlined/></Button>
                        <Button danger onClick={() => deleteRecord(record.key)}><DeleteOutlined/></Button>
                    </Space>)):(
                        <Space>
                            <Button type="primary" onClick={() => saveRecord(record.key)}><PlusCircleOutlined/></Button>
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

    const saveRecord = async (key) =>{
        try{
            await form.validateFields()
        }catch(error){
            console.log("Empty input")
            return
        }

        const isNewRecord = products.find((product) => product.key === key).isNew

        const newData = form.getFieldValue(key)

        if(isNewRecord){
            const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json"
            const addNewProduct = async() =>{
                const response = await fetch(url,{
                    method:'POST',
                    body: JSON.stringify(newData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await response.json()
                const id = data.name
                const newProducts = [...products]
                const indexNewProduct = newProducts.findIndex(product => product.key === key)
                newProducts[indexNewProduct] = {...newData, key: id}
                setProducts(newProducts)
                setEditingKeys(editingKeys.filter((item) => item !== key))
                message.success('Add a new product successfully')
            }
            addNewProduct()
            return
        }
        const url = `https://shop-management-aba6f-default-rtdb.firebaseio.com/products/${key}.json`
        const updateDate = async () =>{
            const response = await fetch(url,{
                method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newData)
            })
            const newProducts = [...products]
            const indexProduct = newProducts.findIndex(product => product.key === key)
            newProducts[indexProduct] = {...newData, key: key}
            setProducts(newProducts)
            setEditingKeys(editingKeys.filter((item) => item !== key))
            message.success(`Update successfully`)
        }
        updateDate()
    }

    const editMultiple = () =>{
        for(const product of products){
            const key = product.key        
            form.setFieldsValue({
                [`${key}`]:{
                    name: product.name,
                    quantity: product.quantity,
                    price: product.price,
                    origin: product.origin,
                    desc: product.desc,
                }
            });
            setEditingKeys((previous) =>{
                return[...previous, product.key]
            })
        }
        setIsSaveAllRecord(true)
    }

    const cancelEditMultiple = () =>{
        const newProducts = products.filter((product) => !product.isNew)
        setProducts(newProducts)
        setEditingKeys([])
        setIsSaveAllRecord(false)
    }

    const submitHandler = async() =>{
        try{
            await form.validateFields()
        }catch(error){
            console.log("Empty input")
        }
        const data = form.getFieldsValue()
        const updateProducts = []
        for(const key in data){
            updateProducts.push({
                key: key,
                name: data[key].name,
                price: data[key].price,
                quantity: data[key].quantity,
                desc: data[key].desc,
                origin: data[key].origin,
            })
        }
        const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json"
        const updateAllRecord = async () =>{
            const response = await fetch(url,{
                method: 'PUT',
                body: JSON.stringify(form.getFieldsValue()),
                headers:{ 
                    'Content-Type': 'application/json'
                }
            })
        }
        updateAllRecord()  
        setProducts(updateProducts)  
        setEditingKeys([])
        setIsSaveAllRecord(false)
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
                title: column.title,
                dataIndex: column.dataIndex,
                editable: column.editable,
                editing: isEditing(record),
            })
        }
    })
    
    return (
        <>
            <Form form={form} validateMessages={validateMessages} onFinish={submitHandler}>
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
                <div style={{width: '100%'}}>
                    <Button style={{width: '100%', color: '#1890ff', backgroundColor: '#cccc', borderColor:'#cccc'}} type="primary" onClick={addRowProduct}><AppstoreAddOutlined/> Add new record</Button>
                </div>
                <br/>
                <div>
                    <Space>
                        {!isSaveAllRecord && products.length !==0 && <Button type="primary" onClick={editMultiple}>Edit multiple</Button>}
                        {isSaveAllRecord && <Button type="primary" htmlType="submit">Save all record</Button>}
                        {isSaveAllRecord && <Button danger onClick={cancelEditMultiple}>Cancel edit multiple</Button>}
                    </Space>
                </div>
            </Form>
        </>
        
    )
}
export default Product