import React, { useState, useEffect } from 'react';
import { Input, DatePicker, message } from 'antd';
import EditTable from '../../components/table/EditTable';
import DisableDate from '../../utils/date/DisableDate';
import { getAllCustomers, updateCustomer, addCustomer, deleteCustomer } from '../../api/CustomerApi';

export const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getAllCustomers().then(setCustomers);
  }, []);

  const addNewCustomer = (data) =>{
    addCustomer(data)
      .then((id) => {
        setCustomers([...customers, { ...data, key: id }]);
        message.success('Add new customer successful');
      });
  }

  const getNewCustomers = (key, data) =>{
    const newCustomers = [...customers];
    const customerIndex = [...customers].findIndex((customer) => customer.key === key);
    newCustomers[customerIndex] = { ...data, key: key };
    return newCustomers
  } 

  const updateDataCustomer = (key,data) =>{
    const newCustomers = getNewCustomers(key, data)
    updateCustomer(key, data)
      .then(() => {
        setCustomers(newCustomers);
        message.success('Update customer successful');
      });
  }

  const onSave = ({ isNew, key, data }) => {
    isNew? addNewCustomer(data): updateDataCustomer(key, data)
  };

  const onDelete = (key) => {
    deleteCustomer(key)
    .then(() =>{
      setCustomers([...customers].filter((customer) => customer.key !== key));
      message.success('Delete customer successful');
    })
  };

  const isEmptyPhoneNumber = (value) =>{
    return value === '' || value === undefined
  }

  const isPhoneNumber = (value) =>{
    const pattern = /^[0-9]+$/;
    return pattern.test(value)
  }

  const checkPhoneNumber = (value) =>{    
    if (isEmptyPhoneNumber(value)) {
      return Promise.reject(new Error('Phone must be require!'));
    }
    if (!isPhoneNumber(value)) {
      return Promise.reject(new Error('Phone must be number!'));
    }
    return Promise.resolve();
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
            validator:(_,value) => checkPhoneNumber(value)
          },
        ],
      },
      width: '20%',
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <EditTable
        columns={columns}
        dataSource={customers}
        pagination={false}
        onSave={({ isNew, key, data }) => onSave({ isNew, key, data })}
        onDelete={(key) => onDelete(key)}
      />
    </div>
  );
};

export default CustomerTable