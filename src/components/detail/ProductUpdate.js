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

const EditableCell = ({editing, editable, dataIndex, title, inputType, record, index, children,...restProps}) => {
        const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

        let childNode = children;

        if (editable) {
            childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={[record.key, dataIndex]}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                {inputNode}
            </Form.Item>
            ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
            >
                {children}
            </div>
            );
        }

    return <td {...restProps}>{childNode}</td>;
};


const Product  = () =>{

    const [form] = Form.useForm()

    const[products, setProducts] = useState([])

    const[isLoading, setIsLoading] = useState(false)

    const[editingKeys, setEditingKeys] = useState([])

    const[isSaveAllRecord, setIsSaveAllRecord] = useState(false)

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
        await form.validateFields()

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
            //
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
        setEditingKeys([])
        setIsSaveAllRecord(false)
    }

    const submitHandler = () =>{
        console.log(form.getFieldsValue())
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
                <div className="add-icon">
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