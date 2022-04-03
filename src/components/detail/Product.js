import React, { useState, useEffect } from 'react';

import { Table, Button, Space, Form, message } from 'antd';

import {
  DeleteOutlined,
  EditOutlined,
  AppstoreAddOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';

import 'antd/dist/antd.css';

import validateMessages from '../common/form/ValidateMessages';
import EditableCell from '../common/table/EditTableCell';
import InputType from '../common/table/InputType';

import { productConvert } from '../Adapters/DataConvert';
import {
  getData,
  addData,
  updateData,
  deleteData,
} from '../Adapters/FetchData';

const Product = () => {
  const [form] = Form.useForm();

  const [products, setProducts] = useState([]);

  const [editingKeys, setEditingKeys] = useState([]);

  const fetchProducts = async () => {
    const url =
      'https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json';
    setProducts(await getData(url, productConvert));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteRecord = async (key) => {
    await deleteData(
      `https://shop-management-aba6f-default-rtdb.firebaseio.com/products/${key}.json`
    );
    setProducts(products.filter((product) => product.key !== key));
  };

  const editRecord = (record) => {
    const key = record.key;
    form.setFieldsValue({
      [`${key}`]: {
        name: record.name,
        quantity: record.quantity,
        price: record.price,
        origin: record.origin,
        desc: record.desc,
      },
    });
    setEditingKeys([...editingKeys, record.key]);
  };

  const isEditing = (record) => {
    return editingKeys.find((key) => key === record.key) ? true : false;
  };

  const cancelUpdateRecord = (key) => {
    setEditingKeys(editingKeys.filter((item) => item !== key));
  };

  const cancelAddNewRecord = (key) => {
    setProducts(products.filter((item) => item.key !== key));
  };

  const addRowProduct = () => {
    const key = Date.now();
    form.setFieldsValue({
      [`${key}`]: {
        quantity: 1,
        price: 1,
      },
    });
    
    const newRowData = {
      key: key,
      name: '',
      price: 1,
      quantity: 1,
      desc: '',
      origin: '',
      isNew: true,
    };
    setEditingKeys([...editingKeys, key]);
    setProducts([...products, { ...newRowData }]);
  };

  const updateRecord = async (key) => {
    await form.validateFields();
    const data = form.getFieldValue(key);
    const id = await updateData(
      `https://shop-management-aba6f-default-rtdb.firebaseio.com/products/${key}.json`,
      data
    );
    const copyProducts = [...products];
    const index = copyProducts.findIndex((product) => product.key === key);
    copyProducts[index] = { ...data, key: id };
    setProducts(copyProducts);
    setEditingKeys(editingKeys.filter((item) => item !== key));
    message.success('Update successfully');
  };

  const saveRecord = async (key) => {
    await form.validateFields();
    const data = form.getFieldValue(key);
    const id = await addData(
      'https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json',
      data
    );
    const copyProducts = [...products];
    const index = copyProducts.findIndex((product) => product.key === key);
    copyProducts[index] = { ...data, key: id };
    setProducts(copyProducts);
    setEditingKeys(editingKeys.filter((item) => item !== key));
    message.success('Add a new product successfully');
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', editable: true },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      editable: true,
    },
    { title: 'Price', dataIndex: 'price', key: 'price', editable: true },
    { title: 'Origin', dataIndex: 'origin', key: 'origin', editable: true },
    { title: 'Description', dataIndex: 'desc', key: 'desc', editable: true },
    {
      title: 'Action',
      dataIndex: '',
      key: '',
      render: (record) => {
        const editable = isEditing(record);
        return !record.isNew ? (
          editable ? (
            <Space>
              <Button type="primary" onClick={() => updateRecord(record.key)}>
                <CheckOutlined />
              </Button>
              <Button danger onClick={() => cancelUpdateRecord(record.key)}>
                <CloseOutlined />
              </Button>
            </Space>
          ) : (
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  editRecord(record);
                }}
              >
                <EditOutlined />
              </Button>
              <Button danger onClick={() => deleteRecord(record.key)}>
                <DeleteOutlined />
              </Button>
            </Space>
          )
        ) : (
          <Space>
            <Button type="primary" onClick={() => saveRecord(record.key)}>
              <PlusCircleOutlined />
            </Button>
            <Button danger onClick={() => cancelAddNewRecord(record.key)}>
              <CloseOutlined />
            </Button>
          </Space>
        );
      },
    },
  ];

  const customColumns = columns.map((column) => {
    if (!column.editable) {
      return column;
    }
    return {
      ...column,
      onCell: (record) => ({
        record,
        inputType: InputType(column.dataIndex),
        title: column.title,
        dataIndex: column.dataIndex,
        editable: column.editable,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Form form={form} validateMessages={validateMessages}>
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
        <div style={{ width: '100%' }}>
          <Button
            style={{
              width: '100%',
              color: '#1890ff',
              backgroundColor: '#cccc',
              borderColor: '#cccc',
            }}
            type="primary"
            onClick={addRowProduct}
          >
            <AppstoreAddOutlined /> Add new record
          </Button>
        </div>
      </Form>
    </>
  );
};
export default Product;
