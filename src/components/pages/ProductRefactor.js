import React, { useState, useEffect } from 'react';
import { Form, Input, Popconfirm, Typography, Space, Button, message, InputNumber } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';
import EditTable from '../common/table/EditTable';
import { getAllProducts, updateProduct, addProduct, deleteProduct} from '../api/ProductApi';

const ProductRefactors = () =>{
    const [form] = Form.useForm()
    const [products, setProducts] = useState(null)
    const [editingKeys, setEditingKeys] = useState([])

    useEffect(() => {
        getAllProducts().then((data) => 
            setProducts(
                Object.keys(data).map((key)=>{
                    return{
                        key: key,
                        name: data[key].name,
                        price: data[key].price,
                        quantity: data[key].quantity,
                        desc: data[key].desc,
                        origin: data[key].origin,
                    }
                })
            )
        )
    },[])

    const save = async (key) =>{
        let data = ''
        try{
            data = await form.validateFields()
        }catch(error){
            console.log("Empty input")
            return
        }
        const newData = [...products]
        const index = products.findIndex((item) => item.key === key)
        if(products[index].isNew){
            await addProduct(data[key]).
                then((id) => newData[index] = {
                    ...data[key],
                    key: id,
                }).
                then(() => setProducts(newData)).
                then(() => message.success("Add product successfully"))
        }else{
            await updateProduct(key, data[key]).
                then((id) => newData[index] = {
                    ...data[key],
                    key: id
                }).
                then(() => setProducts(newData)).
                then(() => message.success("Update product successfully"))
        }
        setEditingKeys([...editingKeys].filter((item) => item !== key))
    }

    const cancel = (record) =>{
        setEditingKeys([...editingKeys].filter((item) => item !== record.key))
        if(record.isNew){
            setProducts([...products].filter((item) => item.key !== record.key))
        }
    }

    const remove = (key) =>{
        deleteProduct((key)).
            then(() => setProducts([...products].filter((product) => product.key !== key))).
            then(() => message.success("Delete successfully"))
    }

    const addNewRow = () =>{
        const key = Date.now()
        const newProduct = {
            key: key,
            name: '',
            price: 1,
            quantity: 1,
            desc: '',
            origin: '',
            isNew: true
        }
        form.setFieldsValue({
            [`${key}`]:{
                price: 1,
                quantity: 1,
            }
        })
        setProducts([...products,{...newProduct}])
        setEditingKeys([...editingKeys, key])
    }

    const edit = (record) =>{
        setEditingKeys([...editingKeys, record.key])
        form.setFieldsValue({
            [`${record.key}`]:{
                name: record.name,
                price: record.price,
                quantity: record.quantity,
                desc: record.desc,
                origin: record.origin,
            }
        })
    }

    const isEditing = (record) =>{
        return editingKeys.find((key) => key === record.key)? true: false
    }


    const columns = [
    { 
        title: 'Name', 
        dataIndex: 'name', 
        editable: true,
        inputType: Input,
        formItemProps:{
            rules:[{
                required: true,
                message: 'Name is required'
            }],
            style:{
                width:'50%'
            }
        },
        style:{
            width:'20%'
        } 
    },
    { 
        title: 'Quantity', 
        dataIndex: 'quantity', 
        inputType: InputNumber,
        editable: true,
        elementProps:{
            min: 1
        },
        formItemProps:{
            rules:[{
                required: true,
                message: 'Quantity is required'
            }],
            style:{
                width:'50%'
            }
        },
        style:{
            width:'20%'
        } 
    },
    { 
        title: 'Price', 
        dataIndex: 'price',
        editable: true,
        inputType: InputNumber,
        elementProps:{
            min: 1
        },
        formItemProps:{
            rules:[{
                required: true,
                message: 'Quantity is required'
            }],
            style:{
                width:'50%'
            }
        },
        style:{
            width:'20%'
        } 
    },
    { 
        title: 'Origin', 
        dataIndex: 'origin',
        inputType: Input,
        editable: true, 
        formItemProps:{
            rules:[{
                required: true,
                message: 'Origin is required'
            }],
            style:{
                width:'50%'
            }
        },
        style:{
            width:'20%'
        } 
    },
    { 
        title: 'Description', 
        dataIndex: 'desc',
        inputType: Input,
        editable: true, 
        formItemProps:{
            style:{
                width:'50%'
            }
        },
        style:{
            width:'20%'
        }  
    },
    {
        title: 'Action',
        dataIndex: '',
        key: '',
        render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
            <span>
                <Typography.Link
                    onClick={() => save(record.key)}
                    style={{
                        marginRight: 8,
                    }}
                >
                    Save
                </Typography.Link>
                <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(record)}>
                    <a>Cancel</a>
                </Popconfirm>
            </span>
        ) : (
            <span>
                <Space>
                    <Typography.Link
                        // disabled={editingKeys !== ''}
                        onClick={() => edit(record)}
                    >
                    Edit
                    </Typography.Link>
                    <Typography.Link
                        // disabled={editingKeys !== ''}
                        onClick={() => remove(record.key)}
                    >
                    Delete
                    </Typography.Link>
                </Space>
            </span>
        );
        },
    }]

    return(
        <>
            <EditTable 
                columns={columns} 
                dataSource={products} 
                pagination={false} 
                form={form} 
                editable={
                    {
                      isEditing: isEditing
                    }
                  }
            />
            <div style={{ width: '100%' }}>
                <Button
                    style={{
                        width: '100%',
                        color: '#1890ff',
                        backgroundColor: '#cccc',
                        borderColor: '#cccc',
                    }}
                    type="primary"
                    onClick={addNewRow}
            >
                <AppstoreAddOutlined/> Add new product
                </Button>
            </div>
        </>
    )
}

export default ProductRefactors