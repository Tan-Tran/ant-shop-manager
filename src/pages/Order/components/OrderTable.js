import React, { useEffect, useState } from 'react';
import { Button, Tag, message, Popconfirm} from 'antd';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import Editable from '../../../components/table/EditTable';
import { getAllOrders, deleteOrder } from '../../../api/OrderApi';
import { getAllProducts } from '../../../api/ProductApi';
import 'antd/dist/antd.css';

export const OrderTable = () => {
  const history = useHistory();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    getAllOrders().then(setOrders);
    getAllProducts().then(setProducts);
  }, []);

  useEffect(() => {
    if(orders.length !==0 && products.length !== 0){
      const productsJson = products.reduce((map, product) => {
        map[product.key] = product
        return map
      },{})
      const data = orders.map((order) =>{
        const productsData = order?.orderItemsList.map((item) =>{
          return {
            productName: productsJson[item.productId].name,
            total: productsJson[item.productId].price * item.quantity
          }
        })
        return{
          key: order.id,
          customerName: order?.customerDTO.name,
          delivery: order?.delivery,
          date: new Date(order?.createAt).toLocaleDateString('en-GB'),
          productNames: productsData.map((item) => {
            return item.productName
          }),
          total: productsData.reduce((prev, current) => prev + current.total, 0)
        }
      })
      setDataSource(data)
    }
  },[orders, products]);

  const onDelete = (key) => {
    setDataSource([...dataSource].filter((data) => data.key !== key));
    message.success('Delete successful');
    deleteOrder(key);
  };

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customerName',
      editable: false,
      width: '300px',
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
      width: '300px',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      editable: false,
      width: '300px',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      editable: false,
      width: '300px',
    },
    {
      title: 'Action',
      dataIndex: '',
      render: (_,record) => {
        return (
          <Popconfirm
              title="Sure to cancel?"
              onConfirm={() => onDelete(record.key)}
            >
              <Button icon={<DeleteOutlined />}/>
          </Popconfirm>          
        );
      },
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Editable
        columns={columns}
        dataSource={dataSource}
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
    </div>
  );
};
export default OrderTable