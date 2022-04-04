import React, { useState, useEffect } from 'react';

import {
  Table,
  Button,
  Space,
  Spin,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
  LoadingOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import moment from 'moment';

import formatDate from '../format/formatDate';

import 'antd/dist/antd.css';

import './Customer.css';

const loadingIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const Customer = () => {
  const [form] = Form.useForm();

  const [customers, setCustomers] = useState([]);

  const [editRowId, setEditRowId] = useState(null);

  const [hasNewCustomerBefore, setHasNewCustomerBefore] = useState(false);

  const [rowData, setRowData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchCustomers = async () => {
    const url =
      'https://shop-management-aba6f-default-rtdb.firebaseio.com/customers.json';
    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Some thing went wrong!');
      }
      const data = await response.json();
      const loadedCustomers = [];
      for (const key in data) {
        loadedCustomers.push({
          key: key,
          name: data[key].name,
          age: data[key].age,
          address: data[key].address,
          dateOfBirth: data[key].dateOfBirth,
          phone: data[key].phone,
        });
      }
      setCustomers(loadedCustomers);
      setHasNewCustomerBefore(false);
    } catch (error) {
      console.log('error', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = (key) => {
    const url = `https://shop-management-aba6f-default-rtdb.firebaseio.com/customers/${key}.json`;

    const removeCustomer = async () => {
      try {
        const response = await fetch(url, {
          method: 'DELETE',
        });
        const newCustomers = customers.filter((item) => item.key !== key);
        setCustomers(newCustomers);
      } catch (error) {
        console.log('delete error');
      }
    };
    removeCustomer();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '300px',
      render: (text, record) => {
        if (record.key === editRowId) {
          return (
            <Form.Item name="name" rules={[{ required: true }]}>
              <Input style={{ width: 100 }} />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: '300px',
      render: (text, record) => {
        if (record.key === editRowId) {
          return (
            <Form.Item
              name="age"
              rules={[{ type: 'number', min: 1, required: true }]}
            >
              <InputNumber min={1} />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: '300px',
      render: (text, record) => {
        if (record.key === editRowId) {
          return (
            <Form.Item name="address" rules={[{ required: true }]}>
              <Input style={{ width: 100 }} />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: 'Date of birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: '300px',
      render: (text, record) => {
        if (record.key === editRowId) {
          return (
            <Form.Item name="birth" rules={[{ required: true }]}>
              <DatePicker
                format={formatDate}
                disabledDate={(d) =>
                  !d || d.isAfter(new Date().toLocaleDateString())
                }
              />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: '300px',
      render: (text, record) => {
        if (record.key === editRowId) {
          return (
            <Form.Item name="phone" rules={[{ required: true }]}>
              <Input style={{ width: 200 }} />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: 'Action',
      dataIndex: '',
      key: '',
      render: (record) => {
        let editButton = '';
        let updateButton = '';
        let cancelButton = '';
        if (record.new) {
          return (
            <Space>
              <Button type="primary" htmlType="submit">
                <UserAddOutlined />
              </Button>
              <Button danger onClick={() => cancelAddNewRow(record.key)}>
                <CloseOutlined />
              </Button>
            </Space>
          );
        }
        if (hasNewCustomerBefore) {
          editButton = (
            <Button type="primary" disabled>
              <EditOutlined />
            </Button>
          );
        } else {
          editButton = (
            <Button
              type="primary"
              onClick={() => {
                setEditRowId(record.key);
                setRowData(record);
              }}
            >
              <EditOutlined />
            </Button>
          );
        }
        if (record.key === editRowId) {
          editButton = '';
          updateButton = (
            <Button type="primary" htmlType="submit">
              <CheckOutlined />
            </Button>
          );
          cancelButton = (
            <Button
              danger
              onClick={() => {
                setEditRowId(null);
              }}
            >
              <CloseOutlined />
            </Button>
          );
        }
        return (
          <Space>
            {editButton}
            {updateButton}
            {cancelButton}
            <Button danger onClick={() => handleDelete(record.key)}>
              <DeleteOutlined />
            </Button>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    form.setFieldsValue({
      name: rowData?.name,
      age: rowData?.age,
      address: rowData?.address,
      birth: rowData?.dateOfBirth
        ? moment(rowData.dateOfBirth, formatDate)
        : moment(new Date().toLocaleDateString('en-GB'), formatDate),
      phone: rowData?.phone,
    });
  }, [rowData]);

  const submitHandler = (values) => {
    if (editRowId === null) {
      return;
    }

    const newRowData = {
      name: values.name,
      age: values.age,
      address: values.address,
      dateOfBirth: moment(values.birth).format(formatDate),
      phone: values.phone,
    };

    if (hasNewCustomerBefore) {
      const url = `https://shop-management-aba6f-default-rtdb.firebaseio.com/customers.json`;
      const addCustomer = async () => {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(newRowData),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        // remove edit cell
        setEditRowId(null);
        // update customers with a new customer data
        const indexRowUpdate = customers.findIndex(
          (item) => item.key === editRowId
        );
        const newCustomer = [...customers];
        newCustomer[indexRowUpdate] = { ...newRowData, key: editRowId };
        setCustomers(newCustomer);
        setRowData(null);
        // info show success
        message.success('Complete add new customer', 2);
        setHasNewCustomerBefore(false);
        fetchCustomers();
      };
      addCustomer();
    } else {
      const url = `https://shop-management-aba6f-default-rtdb.firebaseio.com/customers/${editRowId}.json`;
      const updateRowData = async () => {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newRowData),
        });
        // remove edit cell
        setEditRowId(null);
        // update customers with a new customer data
        const indexRowUpdate = customers.findIndex(
          (item) => item.key === editRowId
        );
        const newCustomer = [...customers];
        newCustomer[indexRowUpdate] = { ...newRowData, key: editRowId };
        setCustomers(newCustomer);
        setRowData(null);
        // info show success
        message.success('Update complete', 2);
        setHasNewCustomerBefore(false);
      };
      updateRowData();
    }
  };

  const addNewRowHandler = () => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      phone: '',
      birth: moment(new Date().toLocaleDateString('en-GB'), formatDate),
    });
    if (hasNewCustomerBefore) {
      return message.warning('Please complete add a current customer!', 2);
    }
    const numberOfCustomers = customers.length;
    const newCustomer = {
      key: numberOfCustomers,
      name: '',
      age: 0,
      address: '',
      phone: '',
      new: true,
    };
    const newCustomers = [...customers, { ...newCustomer }];
    setEditRowId(numberOfCustomers);
    setCustomers(newCustomers);
    setHasNewCustomerBefore(true);
  };

  const cancelAddNewRow = (key) => {
    const customerIndex = customers.findIndex((item) => item.key === key);
    const newCustomers = [...customers];
    newCustomers.splice(customerIndex, 1);
    setCustomers(newCustomers);
    setHasNewCustomerBefore(false);
  };

  return (
    <>
      {isLoading && (
        <div className="loading">
          <Spin indicator={loadingIcon}></Spin>
        </div>
      )}
      <div className="add-icon">
        <Button type="primary" onClick={addNewRowHandler}>
          Add new row
        </Button>
      </div>
      <Form form={form} onFinish={submitHandler}>
        <Table dataSource={customers} bordered columns={columns} />
      </Form>
    </>
  );
};

export default Customer;
