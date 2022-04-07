import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Popconfirm, Typography, Space, Button, message } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';
import EditTable from '../common/table/EditTable';
import { FormatDate_DD_MM_YYY } from '../format/date/FormatDate';
import { getAllCustomers, updateCustomer, addCustomer, deleteCustomer } from '../api/CustomerApi';
import moment from 'moment';

const CustomerRefactor = () => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState(null);
  const [editingKey, setEditingKey] = useState('');
  const [isExistNewRow, setIsExistNewRow] = useState(false)

  useEffect(() => {
    getAllCustomers().then((data) =>
      setCustomers(
        Object.keys(data).map((key) => {
          return {
            key: key,
            name: data[key].name,
            address: data[key].address,
            dateOfBirth: moment(data[key].dateOfBirth).format(FormatDate_DD_MM_YYY),
            phone: data[key].phone,
          };
        })
      )
    );
  }, []);

  const isEditing = (record) => {
    return editingKey === record.key;
  };

  const save = async (key) => {
    let data = ''
    try{
        data = await form.validateFields();
    }catch(error){
        console.log("Empty input")
        return;
    }
    const newData = [...customers];
    const index = customers.findIndex((item) => item.key === key);
    if(customers[index].isNew){
        await addCustomer(data[key]).
            then((id) => newData[index] = {
                    ...data[key], 
                    key: id,
                    dateOfBirth: moment(data[key].dateOfBirth).format(FormatDate_DD_MM_YYY)
            }).
            then(() => setCustomers(newData)).
            then(() => setIsExistNewRow(false)).
            then(() => message.success("Add customer successfully"))
    }else{
        await updateCustomer(key, data[key]).
            then((id) => newData[index] = {
                ...data[key],
                key: id,
                dateOfBirth: moment(data[key].dateOfBirth).format(FormatDate_DD_MM_YYY)
            }).
            then(() => setCustomers(newData)).
            then(() => message.success("Update customer successfully"))
    }
    setEditingKey('');
  };

  const edit = (record) => {
    setEditingKey(record.key);
    form.setFieldsValue({
      [`${record.key}`]: {
        name: record.name,
        address: record.address,
        dateOfBirth: moment(record.dateOfBirth, FormatDate_DD_MM_YYY),
        phone: record.phone,
      },
    });
  };

  const cancel = (record) => {
    if(record.isNew){
      setCustomers([...customers].filter((customer) => customer.key !== record.key))
    }
    setEditingKey('');
    setIsExistNewRow(false);
  };

  const remove = (key) => {
    deleteCustomer(key).
        then(() => setCustomers([...customers].filter((customer) => customer.key !== key))).
        then(() => message.success("Delete successful"))
  };

  const addNewRow = () =>{
      if(isExistNewRow){
        return message.warning('Please complete add a current customer!', 2);
      }
      const key = Date.now()
      const newCustomer = {
          key: key,
          name: '',
          address: '',
          dateOfBirth: moment(new Date().toLocaleDateString('en-GB')).format(FormatDate_DD_MM_YYY),
          isNew: true,
      }
      setIsExistNewRow(true)
      setCustomers([...customers, {...newCustomer}])
      setEditingKey(key)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      inputType: Input,
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
      title: 'Address',
      dataIndex: 'address',
      editable: true,
      inputType: Input,
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Address is required',
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
      title: 'Date of birth',
      dataIndex: 'dateOfBirth',
      editable: true,
      elementProps:{
          format: FormatDate_DD_MM_YYY
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Date is required',
          },
        ],
        style: {
          width: '50%',
        },
      },
      inputType: DatePicker,
      style: {
        width: '20%',
      },
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      editable: true,
      inputType: Input,
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Phone is required',
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
      title: 'Action',
      dataIndex: '',
      inputType: 'option',
      style: {
        width: '20%',
      },
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
                disabled={editingKey !== ''}
                onClick={() => edit(record)}
              >
                Edit
              </Typography.Link>
              <Typography.Link
                disabled={editingKey !== ''}
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

  return (
      <>
        <EditTable 
          columns={columns} 
          dataSource={customers} 
          form={form} 
          pagination={false}
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
            <AppstoreAddOutlined/> Add new customer
          </Button>
        </div>
      </>
  );
};

export default CustomerRefactor;
