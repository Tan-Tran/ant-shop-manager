import React, { useState } from 'react';
import { Table, Button, Space } from 'antd';

import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

const expandedRowRender = ({ key, orders, products }) => {
  if (key === null) {
    return;
  }
  console.log(key, orders, products);
  const orderId = key;
  const order = orders.find((order) => order.key === orderId);
  const loadedProducts = [];
  const data = order.products;
  for (const item of data) {
    const product = products.find((product) => product.key === item.key);
    loadedProducts.push({
      key: item.key,
      product: product.name,
      price: product.price,
      quantity: item.quantity,
      desc: product.desc,
      total: product.total,
    });
  }
  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      editable: true,
      width: '300px',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      editable: true,
      width: '200px',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      editable: false,
      width: '200px',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      editable: false,
      width: '200px',
    },
    {
      title: 'Notes',
      dataIndex: 'desc',
      key: 'desc',
      editable: true,
      width: '400px',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: '',
      render: (record) => {
        return (
          <Space>
            <Button type="primary" shape="circle" ghost>
              <PlusCircleOutlined />
            </Button>
            <Button danger shape="circle">
              <MinusCircleOutlined />
            </Button>
          </Space>
        );
      },
    },
  ];
  return (
    <Table
      className="sub-table"
      columns={columns}
      dataSource={loadedProducts}
      pagination={false}
    />
  );
};

export default expandedRowRender;
