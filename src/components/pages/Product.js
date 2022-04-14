import React, { useState, useEffect } from 'react';
import { Input, message, InputNumber } from 'antd';
import EditTable from '../common/table/EditTableFinal';
import { getAllProducts, updateProduct, addProduct, deleteProduct } from '../api/ProductApi';

const ProductRefactors = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts().then(setProducts);
  }, []);

  const onSave = (record) =>{
    if(record.isNew){
      addProduct(record).then(() => message.success("Add new product successful"))
    }else{
      updateProduct(record.key, record).then(() => message.success("Update product successful"))
    }
  }

  const onDelete = (key) =>{
    deleteProduct(key).then(() => message.success("Delete product successful"))
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      inputType: Input,
      formItemProps: {
        initialValue: '',
        rules: [
          {
            required: true,
            message: 'Name is required',
          },
        ],
        style: {
          width: '50%',
        },
      },
      width: '20%'
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      inputType: InputNumber,
      editable: true,
      elementProps: {
        min: 1,
      },
      formItemProps: {
        initialValue: 1,
        rules: [
          {
            required: true,
            message: 'Quantity is required',
          },
        ],
        style: {
          width: '50%',
        },
      },
      width: '20%'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      editable: true,
      inputType: InputNumber,
      elementProps: {
        min: 1,
      },
      formItemProps: {
        initialValue: 1,
        rules: [
          {
            required: true,
            message: 'Price is required',
          },
        ],
        style: {
          width: '50%',
        },
      },
      width: '20%'
    },
    {
      title: 'Origin',
      dataIndex: 'origin',
      inputType: Input,
      editable: true,
      formItemProps: {
        initialValue: '',
        rules: [
          {
            required: true,
            message: 'Origin is required',
          },
        ],
        style: {
          width: '50%',
        },
      },
      width: '20%'
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      inputType: Input,
      editable: true,
      formItemProps: {
        initialValue: '',
        style: {
          width: '50%',
        },
      },
      width: '20%'
    },
  ];

  return (
    <>
      <EditTable
        columns={columns}
        dataSource={products}
        pagination={false}
        onSave={(record) => onSave(record)}
        onDelete={(key) => onDelete(key)}
      />
    </>
  );
};

export default ProductRefactors;
