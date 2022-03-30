import React, {useState, useEffect, useRef, useContext} from 'react';

import {Table, Button, Space, Spin, Form, Input, InputNumber, message} from 'antd'

import { DeleteOutlined, EditOutlined, AppstoreAddOutlined, LoadingOutlined, CheckOutlined, CloseOutlined, PlusCircleOutlined } from '@ant-design/icons'

import 'antd/dist/antd.css'

const loadingIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />

const EditableContext = React.createContext(null)

const EditableRow =  ({index, ...props}) =>{
    const [form] = Form.useForm()
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props}/>
            </EditableContext.Provider>
        </Form>
    );
}

const EditableCell = ({editing, editable, dataIndex, title, inputType, record, children, getData,...restProps}) =>{
    const form = useContext(EditableContext)
    const changeInputHandler = async(data) =>{
        let newValue = data
        if(inputType !== 'number' && inputType !== 'date'){
            newValue = data.target.value
        }
        try{
            await form.validateFields();
            form.setFieldsValue({
                [dataIndex]: newValue
            })
            const newDataProduct = {...form.getFieldsValue(), key: record.key, isNew: record.isNew}
            getData(newDataProduct)
        }catch(error){
            console.log("empty input")
        }
    }
    const inputNode = inputType === 'number'? <InputNumber onChange={changeInputHandler} min={1}/>:<Input onChange={changeInputHandler}/> 

    useEffect(() =>{
        if(editing){
            form.setFieldsValue({
                [dataIndex]: record[dataIndex]
            });
        }
    },[editing])

    const content = editable && editing?
        <Form.Item
            name = {dataIndex}
            style={{width:200}}
            rules={inputType === "number" ? [{ type: 'number', min: 1, required: true}]:[{required: true, message: `Please Input ${title}!`}]}
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

    const[editingKeys, setEditingKeys] = useState([])

    const[updateProducts, setUpdateProducts] = useState([])

    const[hasNewProduct, setHasNewProduct] = useState(false)

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
            setUpdateProducts(loadedProducts)
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
        setEditingKeys((previous) =>{
            return[...previous, record.key]
        })
    }

    const isEditing = (record) =>{
        return editingKeys.find((key) => key === record.key)? true: false
    }

    const cancelUpdateRecord = (key) =>{
        setEditingKeys(editingKeys.filter((item) => item !== key))
        setIsSaveAllRecord(false)
    }
    
    const cancelAddNewRecord = (key) =>{
        const productsAfterRemoveNewRow = products.filter((item) => item.key !== key)
        setProducts(productsAfterRemoveNewRow)
        setHasNewProduct(false)
    }

    const addRowProduct = () =>{
        if(hasNewProduct){
            message.warning("Please complete add new product before")
            return
        }
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
        setHasNewProduct(true)
        const newProducts = [...products, {...newRowData}]
        setProducts(newProducts)
    }

    const getData = (values) =>{
        form.validateFields()
        const newData = {
            key: values.key,
            name: values.name,
            price: values.price,
            quantity: values.quantity,
            desc: values.desc,
            origin: values.origin,
            isNew: values.isNew
        }

        if(updateProducts.length === 0){
            setUpdateProducts([{...newData}])
            return
        }
        
        const indexProduct = updateProducts.findIndex((item) => item.key === newData.key)

        if(indexProduct === -1){
            const newUpdateProducts = [...updateProducts, {...newData}]
            setUpdateProducts(newUpdateProducts)
            return
        }

        const newUpdateProducts = [...updateProducts]
        newUpdateProducts[indexProduct] = {...newData}
        setUpdateProducts(newUpdateProducts)
    }

    const saveRecord = (key) =>{

        const indexProductUpdate = updateProducts.findIndex((item) => item.key === key)

        const newData = {
            name: updateProducts[indexProductUpdate].name,
            price: updateProducts[indexProductUpdate].price,
            quantity: updateProducts[indexProductUpdate].quantity,
            desc: updateProducts[indexProductUpdate].desc,
            origin: updateProducts[indexProductUpdate].origin,
        }

        if(updateProducts[indexProductUpdate].isNew){            
            const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json"
            const addNewProduct = async() =>{
                const response = await fetch(url,{
                    method:'POST',
                    body: JSON.stringify(newData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const newProducts = [...products]
                const indexNewProduct = newProducts.findIndex(product => product.key === key)
                newProducts[indexNewProduct] = {...newData, key: key}
                setUpdateProducts(updateProducts.filter((product) => product.key !== key))
                setProducts(newProducts)
                setEditingKeys(editingKeys.filter((item) => item !== key))
                setHasNewProduct(false)
                message.success('Add a new product successfully')
                fetchProducts()
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
            //
            setUpdateProducts(updateProducts.filter((product) => product.key !== key))
            setEditingKeys(editingKeys.filter((item) => item !== key))
            message.success(`Update ${updateProducts[indexProductUpdate].name} successfully`)
        }
        updateDate()
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
                getData,
            })
        }
    })

    const editMultiple = () =>{
        const productKeys = []
        for(const product of products){            
            productKeys.push(product.key)           
        }
        setEditingKeys(productKeys)
        setIsSaveAllRecord(true)
    }

    const cancelEditMultiple = () =>{
        setEditingKeys([])
        setIsSaveAllRecord(false)
    }

    const saveAllRecord = () =>{
        const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json"
        const allRecordUpdate = {}
        
        for(const product of updateProducts){
            const key = product.key
            allRecordUpdate[key] = {
                desc: product.desc,
                name: product.name,
                origin: product.origin,
                price: product.price,
                quantity: product.quantity,
            }
        }
        const updateAllRecord = async () =>{
            const response = await fetch(url,{
                method: 'PUT',
                body: JSON.stringify(allRecordUpdate),
                headers:{ 
                    'Content-Type': 'application/json'
                }
            })
        }
        updateAllRecord()        
        setEditingKeys([])
        setIsSaveAllRecord(false)
    }

    const form = Form.useForm()
    
    return (
        <>
            {isLoading && <div className="loading">
                <Spin indicator={loadingIcon}/>
            </div>}           
            <div className="add-icon">
                <Button type="primary" onClick={addRowProduct}><AppstoreAddOutlined/></Button>
            </div>
            <Table
                pagination={false}
                dataSource={products}
                columns={customColumns}
                components={{
                    body: {
                        cell: EditableCell,
                        row: EditableRow,
                    },
                }}
            />
            <div className="add-icon">
                <Space>
                    {!isSaveAllRecord && <Button type="primary" onClick={editMultiple}>Edit multiple</Button>}
                    {isSaveAllRecord && <Button type="primary" onClick={saveAllRecord}>Save all record</Button>}
                    {isSaveAllRecord && <Button danger onClick={cancelEditMultiple}>Cancel edit multiple</Button>}
                </Space>
            </div>
        </>
        
    )
}
export default Product