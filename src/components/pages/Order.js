import React, { useEffect, useState } from 'react';
import { Button, Tag, message } from 'antd';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import Editable from '../common/table/EditTable';
import { getAllOrders, deleteOrder } from '../api/OrderApi';

const Order = () => {
  const history = useHistory();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getAllOrders().then((data) =>
      setOrders(
        Object.keys(data).map((key) => {
          return {
            key: key,
            customerId: data[key].customerId,
            customerName: data[key].customerName,
            delivery: data[key].delivery,
            productNames: data[key].products.map(
              (product) => product.productName
            ),
            total: data[key].products.reduce(
              (prev, current) => prev + current.total,
              0
            ),
            date: new Date(data[key].createAt).toLocaleDateString('en-US'),
          };
        })
      )
    );
  }, []);

  const removeOrder = async (key) => {
    deleteOrder(key)
      .then(() => setOrders([...orders].filter((order) => order.key !== key)))
      .then(() => message.success('Delete successful'));
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
      width: '600px',
      render: (_, record) => (
        <>
          {record.productNames.map((productName) => {
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
            <DeleteOutlined onClick={() => removeOrder(record.key)} />
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
