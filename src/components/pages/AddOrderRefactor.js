import React, { useState, useEffect } from 'react';
import { Form, Input, Popconfirm, Typography, Space, Button, message, InputNumber, Select } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';
import EditTable from '../common/table/EditTable';
import { getAllProducts, updateProduct, addProduct, deleteProduct} from '../api/ProductApi';

const {Option} = Select

const AddOrderRefactor = () =>{
    
    const [form] = Form.useForm()

    const [products, setProducts] = useState(null)

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

    const remove = () =>{

    }

    const columns = [
        { 
            title: 'Product', 
            dataIndex: 'product', 
            key: 'product', 
            editable: true,
            InputType: Select,
            elementProps:{
                options: products.map((product) => {
                    return(
                        <Option key={product.key} value={product.key}>
                            {product.name}
                        </Option>
                    )
                })
            },
            formItemProps:{
                rules:{
                    required: true,
                    message: 'Product is required'
                },
                style:{
                    width: '50%'
                }
            },
            style:{
                width: '20%'
            }
        },
        { 
            title: 'Quantity', 
            dataIndex: 'quantity', 
            key: 'quantity',
            dataType: InputNumber,
            editable: true, 
            formItemProps:{
                rules:{
                    required: true,
                    message: 'Quantity is required'
                },
                style:{
                    width: '50%'
                }
            },
            style:{
                width: '20%'
            }
        },
        { 
            title: 'Price',
             dataIndex: 'price', 
             key: 'price',
             dataIndex: InputNumber,
             editable: false, 
             formItemProps:{
                rules:{
                    required: true,
                    message: 'Price is required'
                },
                style:{
                    width: '50%'
                }
            },
            style:{
                width: '20%'
            }
            },
        { 
            title: 'Total', 
            dataIndex: 'total', 
            key: 'total',
            editable: false,
            style:{
                width: '20%'
            }
        },
        { 
            title: 'Notes', 
            dataIndex: 'desc', 
            key: 'desc',
            inputType: Input,
            editable: true, 
            formItemProps:{
                style:{
                    width: '50%'
                }
            },
            style:{
                width: '20%'
            }
        },
        {
          title: 'Action',
          dataIndex: '',
          key: '',
          render: (_,record) => {
            return (
                <span>
                    <Space>
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
        },
      ];
    
    
    return(
        <>
            <EditTable
                columns={columns}
                dataSource={products}
                form={form} 
                pagination={false}
                editable={
                    {
                    }
                }
            />
        </>
    )
}

export default AddOrderRefactor;