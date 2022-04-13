import React, { useState, useEffect } from 'react';
import { Input, message, InputNumber } from 'antd';
import EditTable from '../common/table/EditTable';
import AddNewRowButton from '../common/table/button/AddNewRowButton';
import { getAllProducts,updateProduct,addProduct,deleteProduct } from '../api/ProductApi';

const ProductRefactors = () => {
  const [products, setProducts] = useState(null);
  const [isExistNewRow, setIsExistNewRow] = useState(false);

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
        .then((id) => {
          setProducts([
            ...products.filter((product) => product.key !== key),
            {
              ...data,
              key: id,
            },
          ]);
          setIsExistNewRow(false);
        })
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

  const addNewRow = () => {
    if (isExistNewRow) {
      message.warn('Please complete add new products');
      return;
    }
    let newData = {
      key: Date.now(),
      isNew: true,
    };
    for (const column of columns) {
      newData[`${column.dataIndex}`] = column.formItemProps?.initialValue;
    }
    setProducts([...products, { ...newData }]);
    setIsExistNewRow(true);
  };

  const onCancel = (record) => {
    if(record.isNew){
        setProducts([...products].filter((product) => product.key !== record.key));
    }
    setIsExistNewRow(false);
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
        onSave={({ key, data, method }) => save({ key, data, method })}
        onDelete={(key) => remove(key)}
        onCancel={(record) => onCancel(record)}
      />
      <AddNewRowButton addNewRow={addNewRow} title={'Add new product'}/>
    </>
  );
};

export default ProductRefactors;
