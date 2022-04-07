import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Popconfirm, Typography, Space } from 'antd';
import EditTable from '../common/table/EditTable';
import { FormatDate_DD_MM_YYY } from '../format/date/FormatDate';
import { getAllCustomers, updateCustomer } from '../api/CustomerApi';

import moment from 'moment';

const CustomerRefactor = () => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState(null);
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    getAllCustomers().then((data) =>
      setCustomers(
        Object.keys(data).map((key) => {
          return {
            key: key,
            name: data[key].name,
            address: data[key].address,
            dateOfBirth: data[key].dateOfBirth,
            phone: data[key].phone,
          };
        })
      )
    );
  }, []);

  const isEditing = (record) => {
    return editingKey === record.key;
  };

  const save = async (record) => {
    const data = await form.validateFields();
    const key = record.key;
    const newData = [...customers];
    const index = customers.findIndex((item) => item.key === key);
    const id = updateCustomer(key, data[key]);
    newData[index] = {
      ...data[key],
      key: id,
      dateOfBirth: moment(data[key].dateOfBirth).format(FormatDate_DD_MM_YYY),
    };
    setCustomers(newData);
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
    setEditingKey('');
  };

  const remove = (record) => {};

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      dataType: <Input />,
      restProps: {
        rules: [
          {
            required: true,
            message: 'Name is required',
          },
        ],
        style: {
          width: '20%',
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
      dataType: <Input />,
      restProps: {
        rules: [
          {
            required: true,
            message: 'Address is required',
          },
        ],
        style: {
          width: '20%',
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
      restProps: {
        rules: [
          {
            required: true,
            message: 'Date is required',
          },
        ],
        style: {
          width: '20%',
        },
      },
      dataType: <DatePicker format={FormatDate_DD_MM_YYY} />,
      style: {
        width: '20%',
      },
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      editable: true,
      dataType: <Input />,
      restProps: {
        rules: [
          {
            required: true,
            message: 'Phone is required',
          },
        ],
        style: {
          width: '20%',
        },
      },
      style: {
        width: '20%',
      },
    },
    {
      title: 'Action',
      dataIndex: '',
      style: {
        width: '20%',
      },
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
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
                onClick={() => remove(record)}
              >
                Delete
              </Typography.Link>
            </Space>
          </span>
        );
      },
    },
  ];

  const mergeColumns = columns.map((column) => {
    if (!column.editable) {
      return column;
    }
    return {
      ...column,
      onCell: (record) => ({
        record,
        editable: column.editable,
        inputType: column.dataType,
        dataIndex: column.dataIndex,
        title: column.title,
        editing: isEditing(record),
        restProps: column.restProps,
      }),
    };
  });

  return (
    <EditTable columns={mergeColumns} dataSource={customers} form={form} />
  );
};

export default CustomerRefactor;
