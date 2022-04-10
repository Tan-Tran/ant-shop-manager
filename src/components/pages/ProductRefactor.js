import React, { useState, useEffect } from 'react';
import { Input, message, InputNumber } from 'antd';
import EditTableWithAddButton from '../common/table/EditTableWithAddButton';
import {
  getAllProducts,
  updateProduct,
  addProduct,
  deleteProduct,
} from '../api/ProductApi';

const ProductRefactors = () => {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    getAllProducts().then((data) =>
      setProducts(
        Object.keys(data).map((key) => {
          return {
            key: key,
            name: data[key].name,
            price: data[key].price,
            quantity: data[key].quantity,
            desc: data[key].desc,
            origin: data[key].origin,
          };
        })
      )
    );
  }, []);

  const save = async ({ key, data, method }) => {
    if (method === 'POST') {
      await addProduct(data)
        .then((id) =>
          setProducts([
            ...products,
            {
              ...data,
              key: id,
            },
          ])
        )
        .then(() => message.success('Add product successfully'));
    }
    if (method === 'PUT') {
      const newData = [...products];
      const index = products.findIndex((item) => item.key === key);
      newData[index] = {
        ...data,
      };
      setProducts(newData);
      await updateProduct(key, data).then(() =>
        message.success('Update product successfully')
      );
    }
  };

  const remove = (key) => {
    deleteProduct(key)
      .then(() =>
        setProducts([...products].filter((product) => product.key !== key))
      )
      .then(() => message.success('Delete successful'));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      inputType: Input,
      defaultValue: '',
      formItemProps: {
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
      style: {
        width: '20%',
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      inputType: InputNumber,
      defaultValue: 1,
      editable: true,
      elementProps: {
        min: 1,
      },
      formItemProps: {
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
      style: {
        width: '20%',
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      editable: true,
      inputType: InputNumber,
      defaultValue: 1,
      elementProps: {
        min: 1,
      },
      formItemProps: {
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
      style: {
        width: '20%',
      },
    },
    {
      title: 'Origin',
      dataIndex: 'origin',
      inputType: Input,
      defaultValue: '',
      editable: true,
      formItemProps: {
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
      style: {
        width: '20%',
      },
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      inputType: Input,
      defaultValue: '',
      editable: true,
      formItemProps: {
        style: {
          width: '50%',
        },
      },
      style: {
        width: '20%',
      },
    },
  ];

  return (
    <EditTableWithAddButton
      columns={columns}
      dataSource={products}
      pagination={false}
      onSave={({ key, data, method }) => save({ key, data, method })}
      onDelete={(key) => remove(key)}
    />
  );
};

export default ProductRefactors;
