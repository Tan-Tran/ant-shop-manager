import React, { useState, useEffect } from 'react';
import { Input, DatePicker, message } from 'antd';
import EditTableWithAddButton from '../common/table/EditTableWithAddButton';
import { FormatDate_DD_MM_YYY } from '../format/date/FormatDate';
import {
  getAllCustomers,
  updateCustomer,
  addCustomer,
  deleteCustomer,
} from '../api/CustomerApi';
import moment from 'moment';

const CustomerRefactor = () => {

  const [customers, setCustomers] = useState(null);
  
  useEffect(() => {
    getAllCustomers().then((data) =>
      setCustomers(
        Object.keys(data).map((key) => {
          return {
            key: key,
            name: data[key].name,
            address: data[key].address,
            dateOfBirth: moment(data[key].dateOfBirth).format(
              FormatDate_DD_MM_YYY
            ),
            phone: data[key].phone,
          };
        })
      )
    );
  }, []);

  const save = async ({ key, data, method }) => {
    if (method === 'POST') {
      await addCustomer(data)
        .then((id) =>
          setCustomers([
            ...customers,
            {
              ...data,
              key: id,
              dateOfBirth: moment(data.dateOfBirth).format(
                FormatDate_DD_MM_YYY
              ),
            },
          ])
        )
        .then(() => message.success('Add customer successfully'));
    }
    if (method === 'PUT') {
      const newData = [...customers];
      const index = customers.findIndex((item) => item.key === key);
      newData[index] = {
        ...data,
        dateOfBirth: moment(data.dateOfBirth).format(FormatDate_DD_MM_YYY),
      };
      setCustomers(newData);
      await updateCustomer(key, data).then(() =>
        message.success('Update customer successfully')
      );
    }
  };

  const remove = (key) => {
    deleteCustomer(key)
      .then(() =>
        setCustomers([...customers].filter((customer) => customer.key !== key))
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
      title: 'Address',
      dataIndex: 'address',
      editable: true,
      inputType: Input,
      defaultValue: '',
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Address is required',
          },
        ],
        style: {
          width: '100%',
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
      defaultValue: moment(new Date().toLocaleDateString('en-GB')).format(
        FormatDate_DD_MM_YYY
      ),
      elementProps: {
        format: FormatDate_DD_MM_YYY,
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Date is required',
          },
        ],
        style: {
          width: '100%',
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
      defaultValue: '',
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Phone is required',
          },
        ],
        style: {
          width: '100%',
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
      dataSource={customers}
      pagination={false}
      onSave={({ key, data, method }) => save({ key, data, method })}
      onDelete={(key) => remove(key)}
    />
  );
};

export default CustomerRefactor;
