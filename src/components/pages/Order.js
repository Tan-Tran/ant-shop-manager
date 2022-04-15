import React, { useEffect, useState } from 'react';
import { Button, Tag, message } from 'antd';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import Editable from '../common/table/EditTableFinal';
import { getAllOrders, deleteOrder } from '../api/OrderApi';
import 'antd/dist/antd.css';

const Order = () => {
  const history = useHistory();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getAllOrders().then(setOrders);
  }, []);

  const onDelete = async (key) => {
    deleteOrder(key);
    setOrders([...orders].filter((order) => order.key !== key));
    message.success('Delete successful');
  };

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customerName',
      editable: false,
      width: '200px',
    },
    {
      title: 'Product',
      dataIndex: 'productNames',
      width: '300px',
      render: (_, record) => (
        <>
          {record.productNames?.map((productName) => {
            return (
              <Tag name="productName" color="geekblue" key={productName}>
                {productName.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Delivery address',
      dataIndex: 'delivery',
      editable: false,
      width: '200px',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      editable: false,
      width: '200px',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      editable: false,
      width: '200px',
    },
    {
      title: 'Action',
      dataIndex: '',
      render: (record) => {
        return (
          <Button danger>
            <DeleteOutlined onClick={() => onDelete(record.key)} />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Editable
        columns={columns}
        dataSource={orders}
        pagination={false}
        showAddNewRow={false}
        useActionColumnDefault={false}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              history.push(`/order/${record.key}`);
            },
          };
        }}
      />
      <div>
        <Button type="primary" onClick={() => history.push('/order/new')}>
          <PlusCircleOutlined /> Add new order
        </Button>
      </div>
    </>
  );
};

export default Order;
