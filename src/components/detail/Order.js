import React, { useEffect, useState } from 'react';

import { Table, Button, Space, Tag, Form, Input, Select } from 'antd';

import {
  DeleteOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';

import 'antd/dist/antd.css';

import moment from 'moment';

import { useHistory } from 'react-router-dom';

import EditableCell from '../common/table/EditTableCell';


import {
  productConvert,
  customerConvert,
  orderListConvert,
} from '../adapters/DataConvert';

import InputType from '../common/table/InputType';

import { getData, deleteData } from '../adapters/FetchData';


const Order = () => {
  const history = useHistory();

  const [products, setProducts] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [orders, setOrders] = useState([]);

  const [ordersData, setOrdersData] = useState([]);

  const [form] = Form.useForm();

  const fetchProducts = async () => {
    const url =
      'https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json';
    setProducts(await getData(url, productConvert));
  };

  const fetchCustomers = async () => {
    const url =
      'https://shop-management-aba6f-default-rtdb.firebaseio.com/customers.json';
    setCustomers(await getData(url, customerConvert));
  };

  const fetchOrders = async () => {
    const url =
      'https://shop-management-aba6f-default-rtdb.firebaseio.com/orders.json';
    setOrders(await getData(url, orderListConvert));
  };

  useEffect(() => {
    fetchCustomers();
    fetchOrders();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (customers.length !== 0 && orders.length !== 0) {
      const data = [];
      for (const order of orders) {
        const orderId = order.key;
        const customer = customers.find(
          (item) => item.key === order.customerId
        );
        const orderData = {
          key: orderId,
          customerName: customer?.name,
          delivery: order.delivery,
          productNames: [],
          dateOrder: new Date(order.dateOrder).toLocaleDateString('en-US'),
          total: 0,
        };
        for (const product of order.products) {
          orderData.productNames.push(product.name);
          orderData.total = orderData.total + product.total;
        }
        data.push(orderData);
      }
      setOrdersData(data);
    }
  }, [customers, orders]);


  const deleteOrder = async (key) =>{
    const url = `https://shop-management-aba6f-default-rtdb.firebaseio.com/orders/${key}.json`
    await deleteData(url)
    setOrders(orders.filter((item) => item.key !== key))
  }

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      editable: false,
      width: '200px',
    },
    {
      title: 'Product',
      dataIndex: 'productNames',
      key: 'productNames',
      width: '600px',
      render: (productNames) => (
        <>
          {productNames.map((productName) => {
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
        key: 'delivery',
        editable: false,
        width: '200px',
    },
    {
      title: 'Date',
      dataIndex: 'dateOrder',
      key: 'dateOrder',
      editable: false,
      width: '200px',
    },
    { title: 'Total', dataIndex: 'total', key: 'total', editable: false,  width: '200px', },
    {
      title: 'Action',
      dataIndex: '',
      key: '',
      render: (_, record) => {
        return (
          <Button danger>
            <DeleteOutlined onClick={() => deleteOrder(record.key)}/>
          </Button>
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
        dataIndex: column.dataIndex,
        title: column.title,
      }),
    };
  });

  return (
    <>
      <Form form={form}>
        <Table
          pagination={false}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                history.push(`/order/${record.key}`)
              },
            };
          }}
          className="components-table-demo-nested"
          columns={customColumns}
          dataSource={ordersData}
        />
      </Form>
      <div>
        <Button type="primary" onClick={() => history.push('/order/new')}>
          <PlusCircleOutlined /> Add new order
        </Button>
      </div>
    </>
  );
};

export default Order;
