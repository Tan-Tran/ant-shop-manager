import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';

import {
  Form,
  Button,
  Row,
  Col,
  Table,
  Card,
  Space,
  message,
  Divider,
  Input,
} from 'antd';

import { AppstoreAddOutlined, DeleteOutlined } from '@ant-design/icons';

import validateMessages from '../common/form/ValidateMessages';

import { productConvert, customerConvert } from '../Adapters/DataConvert';

import { getData } from '../Adapters/FetchData';

import EditableCell from '../common/table/EditTableCell';
import InputType from '../common/table/InputType';
import SelectCustomer from '../common/form/SelectCustomer';

const AddOrderTable = () => {
  const [form] = Form.useForm();

  const [products, setProducts] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [customer, setCustomer] = useState({});

  const [total, setTotal] = useState(0);

  const [tempItems, setTempItems] = useState([]);

  const history = useHistory();

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

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  const checkDuplicate = (value) => {
    return tempItems.filter((item) => item.productId === value).length > 1;
  };

  const removeCurrentProduct = (key) => {
    let newItems = [...tempItems].filter((item) => item.key !== key);
    let total = 0;
    for (const item of newItems) {
      total = total + item.total;
    }
    form.validateFields();
    setTotal(total);
    setTempItems(newItems);
  };

  const selectCustomerHandler = (values) => {
    const currentCustomer = customers.find((item) => item.key === values);
    setCustomer(currentCustomer);
    form.setFieldsValue({
      customer: currentCustomer.key,
    });
  };

  const addNewItems = () => {
    const key = Date.now();
    form.setFieldsValue({
      [`${key}`]: {
        quantity: 1,
        desc: 'No desc',
      },
    });
    const newItem = {
      key: key,
      product: '',
      productId: '',
      quantity: 1,
      price: 0,
      total: 0,
      desc: '',
      isNew: true,
    };
    setTempItems([...tempItems, { ...newItem }]);
  };

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
            <Button danger onClick={() => removeCurrentProduct(record.key)}>
              <DeleteOutlined />
            </Button>
          </Space>
        );
      },
    },
  ];

  const getDataHandler = (data) => {
    const key = data.key;
    const dataUpdate = form.getFieldValue(key);
    const copyItems = [...tempItems];
    const indexItemNeedUpdate = copyItems.findIndex((item) => item.key === key);
    const product = products.find((item) => item.key === dataUpdate.product);
    const newTempItems = {
      ...copyItems[indexItemNeedUpdate],
      product: product.name,
      productId: dataUpdate.product,
      price: product.price,
      quantity: dataUpdate.quantity,
      total: product.price * dataUpdate.quantity,
      desc: dataUpdate.desc,
    };
    copyItems[indexItemNeedUpdate] = newTempItems;
    let total = 0;
    for (const item of copyItems) {
      total = total + item.total;
    }
    setTotal(total);
    setTempItems(copyItems);
  };

  const columnsItems = columns.map((column) => {
    if (!column.editable) {
      return column;
    }
    return {
      ...column,
      onCell: (record) => ({
        record,
        inputType: InputType(column.dataIndex),
        title: column.title,
        dataIndex: column.dataIndex,
        editable: column.editable,
        editing: record.isNew,
        isDuplicate: checkDuplicate,
        getData: getDataHandler,
        dataSelect:
          column.dataIndex === 'product' ? { product: products } : null,
      }),
    };
  });

  const checkoutOrder = async () => {
    const url =
      'https://shop-management-aba6f-default-rtdb.firebaseio.com/orders.json';
    try {
      await form.validateFields();
      const listProducts = tempItems.map((item) => {
        return {
          key: item.productId,
          price: item.price,
          desc: item.desc,
          total: item.total,
          quantity: item.quantity,
          name: item.product,
        };
      });
      const orderData = {
        customerId: customer.key,
        products: listProducts,
        dateOrder: new Date(),
      };
      console.log(orderData);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      message.success('Add order completed');
      history.push('/order');
    } catch (error) {
      console.log('Checkout error');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <Form form={form} validateMessages={validateMessages} component={false}>
        <Row>
          <Col>
            <Form.Item name="customer" rules={[{ required: true }]}>
              <SelectCustomer
                selectCustomerHandler={selectCustomerHandler}
                customers={customers}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card title="Customer Info" bordered={false} style={{ width: 300 }}>
              <p>Name: {customer.name}</p>
              <p>ID: {customer.key}</p>
              <p>Phone: {customer.phone}</p>
              <p>Birth: {customer.dateOfBirth}</p>
              <p>Address: {customer.address}</p>
            </Card>
          </Col>
        </Row>
        <br />
        <Row>
          <Form.Item
            style={{ width: '300px' }}
            name="delivery"
            label="Delivery to"
            placeholder="Please enter deli"
          >
            <Input />
          </Form.Item>
        </Row>
        <Row>
          <h4>Items: {tempItems.length}</h4>
          <Divider type="vertical" />
          <h4>Total: {total}</h4>
        </Row>
        <Table
          className="table-add-order"
          dataSource={tempItems}
          pagination={false}
          columns={columnsItems}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
        ></Table>
        <div style={{ width: '100%' }}>
          <Button
            style={{
              width: '100%',
              color: '#1890ff',
              backgroundColor: '#cccc',
              borderColor: '#cccc',
            }}
            type="primary"
            onClick={addNewItems}
          >
            <AppstoreAddOutlined /> Add new record
          </Button>
        </div>
        <div className="add-icon">
          {tempItems.length > 0 && (
            <Button type="primary" onClick={checkoutOrder}>
              Checkout
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default AddOrderTable;
