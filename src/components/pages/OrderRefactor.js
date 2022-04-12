import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, } from 'antd';
import { DeleteOutlined, PlusCircleOutlined,} from '@ant-design/icons';
import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import EditableCell from '../common/table/EditTableCell';
import { getAllOrders, getOrder } from '../adapters/FetchData';


const Order = () => {
  const history = useHistory();
  const [orders, setOrders] = useState([]);
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    getAllOrders().then((data) =>
        setOrders(
        Object.keys(data).map((key) => {
          return {
            key: key,
            customerId: data[key].customerId,
            customerName: data[key].customerName,
            delivery: data[key].delivery,
            productNames: data[key].products.map((product) => {
                return[]
            }),
          };
        })
      )
    );
  }, []);

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

  return (
    <>
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
      <div>
        <Button type="primary" onClick={() => history.push('/order/new')}>
          <PlusCircleOutlined /> Add new order
        </Button>
      </div>
    </>
  );
};

export default Order;
