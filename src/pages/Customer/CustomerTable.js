import React, { useState, useEffect } from 'react';
import { Input, DatePicker, message } from 'antd';
import EditTable from '../common/table/EditTable';
import DisableDate from '../format/date/DisableDate';
import { getAllCustomers, updateCustomer, addCustomer, deleteCustomer } from '../api/CustomerApi';

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getAllCustomers().then(setCustomers);
  }, []);

  const onSave = ({ isNew, key, data }) => {
    if (isNew) {
      addCustomer(data).then((id) => {
        setCustomers([...customers, { ...data, key: id }]);
        message.success('Add new customer successful');
      });
      return;
    }
    const customerIndex = customers.findIndex((customer) => customer.key === key);
    const newCustomers = [...customers];
    newCustomers[customerIndex] = {...data, key: key};
    updateCustomer(key, data).then(() => {
      setCustomers(newCustomers);
      message.success('Update customer successful');
    });
  };

  const onDelete = (key) => {
    deleteCustomer(key);
    setCustomers([...customers].filter((customer) => customer.key !== key));
    message.success('Delete customer successful');
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
      width: '20%',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      editable: true,
      inputType: Input,
      formItemProps: {
        initialValue: '',
        rules: [
          {
            required: true,
            message: 'Address is required',
          },
        ],
      },
      width: '20%',
    },
    {
      title: 'Date of birth',
      dataIndex: 'dateOfBirth',
      inputType: DatePicker,
      editable: true,
      elementProps: {
        format: 'DD/MM/YYYY',
        disabledDate: DisableDate,
      },
      formItemProps: {
        initialValue: '',
        rules: [
          {
            required: true,
            message: 'Date is required',
          },
        ],
      },
      width: '20%',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      editable: true,
      inputType: Input,
      formItemProps: {
        initialValue: '',
        rules: [
          {
            validator(_, value) {
              const pattern = /^[0-9]+$/;
              if (value === '') {
                return Promise.reject(new Error('Phone must be require!'));
              }
              if (!pattern.test(value)) {
                return Promise.reject(new Error('Phone must be number!'));
              }
              return Promise.resolve();
            },
          },
        ],
      },
      width: '20%',
    },
  ];

  return (
    <>
      <EditTable
        columns={columns}
        dataSource={customers}
        pagination={false}
        onSave={({ isNew, key, data }) => onSave({ isNew, key, data })}
        onDelete={(key) => onDelete(key)}
      />
    </>
  );
};

export default CustomerTable;
