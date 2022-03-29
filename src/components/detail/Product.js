import React, {useState, useEffect, useRef, useContext} from 'react';

import {Table, Button, Space, Spin, Form, Input, InputNumber, message} from 'antd'

import { DeleteOutlined, EditOutlined, PlusCircleOutlined, LoadingOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

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

const EditableCell = ({editing, editable, dataIndex, title, inputType, record, children,saveData,...restProps}) =>{
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
            const newDataProduct = {...form.getFieldsValue(), key: record.key}
            saveData(newDataProduct)
        }catch(error){
            console.log(error.message)
        }
    }

    const inputNode = inputType === 'number'? <InputNumber onChange={changeInputHandler}/>:<Input onChange={changeInputHandler}/> 

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

    const[editingKeys, setEditingKeys] = useState([])

    const[updateProducts, setUpdateProducts] = useState([])

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

    const handleDelete = (key) =>{
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
                        <Button type="primary" onClick={() => handleUpdate(record.key)}><CheckOutlined/></Button>
                        <Button danger><CloseOutlined/></Button>
                    </Space>):
                    (<Space>
                        <Button type="primary" onClick={() => {edit(record)}}><EditOutlined/></Button>
                        <Button danger onClick={() => handleDelete(record.key)}><DeleteOutlined/></Button>
                    </Space>)
                )
            }
        }
    ]

    const isEditing = (record) =>{
        return editingKeys.find((key) => key === record.key)? true: false
    }

    const edit = (record) =>{
        setEditingKeys((previous) =>{
            return[...previous, record.key]
        })
    }

    const saveDataHandler = (values) =>{
        const newData = {
            key: values.key,
            name: values.name,
            price: values.price,
            quantity: values.quantity,
            desc: values.desc,
            origin: values.origin,
        }

        if(updateProducts.length === 0){
            setUpdateProducts([{...newData}])
            return
        }
        
        const indexProduct = updateProducts.findIndex((item) => item.key === newData.key)

        if(indexProduct === -1){
            const copyUpdateProducts = [...updateProducts]
            copyUpdateProducts.push(newData)
            setUpdateProducts(copyUpdateProducts)
            return
        }

        const copyUpdateProducts = [...updateProducts]
        copyUpdateProducts[indexProduct] = {...newData}
        setUpdateProducts(copyUpdateProducts)
    }

    const handleUpdate = (key) =>{

        const indexUpdateProduct = updateProducts.findIndex((item) => item.key === key)
        const copyUpdateProducts = [...updateProducts]
        const newUpdateProducts = copyUpdateProducts.filter((item) => item.key !== key)

        if(indexUpdateProduct !== -1){
            const newData = {
                key: key,
                name: updateProducts[indexUpdateProduct].name,
                price: updateProducts[indexUpdateProduct].price,
                quantity: updateProducts[indexUpdateProduct].quantity,
                desc: updateProducts[indexUpdateProduct].desc,
                origin: updateProducts[indexUpdateProduct].origin,
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
                const copyProducts = [...products]
                const indexProduct = copyProducts.findIndex(product =>product.key === key)
                copyProducts[indexProduct] = [newData]
                console.log(copyProducts)
                setProducts(copyProducts)
                //
                setUpdateProducts(newUpdateProducts)
                setEditingKeys(editingKeys.filter((item) => item !== key))
                message.success(`Update ${updateProducts[indexUpdateProduct].name} successfully`)
            }
            updateDate()
        }
    }    

    const newColumns = columns.map((column) =>{
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
                saveData: saveDataHandler
            })
        }
    }) 
    
    return (
        <>
            {isLoading && <div className="loading">
                <Spin indicator={loadingIcon}/>
            </div>}           
            <div className="add-icon">
                <Button type="primary"><PlusCircleOutlined/></Button>
            </div> 
                <Table
                    dataSource={products}
                    columns={newColumns}
                    components={{
                        body: {
                            cell: EditableCell,
                            row: EditableRow
                        },
                    }}
                />
        </>
        
    )
}
export default Product