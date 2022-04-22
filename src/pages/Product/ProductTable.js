import React, { useState, useEffect } from 'react';
import { Input, message, InputNumber } from 'antd';
import EditTable from '../../components/table/EditTable';
import { getAllProducts,updateProduct,addProduct } from '../../api/ProductApi';

export const ProductTable = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts().then((data) => setProducts(data.filter((item) => item.display !== false)));
  }, []);

  const saveNewProduct = (data) =>{
    addProduct({...data, display: true})
      .then((id) => {
        setProducts([...products, { ...data, key: id }]);
        message.success('Add new product successful');
      });
  }


  const getNewProducts = (key, data) =>{
    const newProducts = [...products];
    const productIndex = products.findIndex((product) => product.key === key);
    newProducts[productIndex] = {...data, key: key};
    return newProducts
  }

  const updateDataProduct = (key, data) =>{
    const newProducts = getNewProducts(key, data)
    updateProduct(key, data)
      .then(() => {
        setProducts(newProducts);
        message.success('Update product successful');
      });
  }

  const onSave = ({ isNew, key, data }) => {
    isNew? saveNewProduct(data): updateDataProduct(key, data)
  };

  const onDelete = (key) => {
    const product = products.find(product => product.key === key)
    updateProduct(key, {...product, display: false})
    setProducts([...products].filter((product) => product.key !== key));
    message.success('Delete product successful');
  };

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
      },
      width: '300px',
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
      },
      width: '300px',
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
      },
      width: '300px',
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
      },
      width: '300px',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      inputType: Input,
      editable: true,
      formItemProps: {
        initialValue: '',
      },
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <EditTable
        columns={columns}
        dataSource={products}
        pagination={false}
        onSave={({ isNew, key, data }) => onSave({ isNew, key, data })}
        onDelete={(key) => onDelete(key)}
      />
    </div>
  );
};

export default ProductTable