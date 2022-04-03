import React, { useEffect, useState } from 'react';

import {
  Form,
  Select,
  InputNumber,
  Input,
  Button,
  Row,
  Col,
  Table,
  Card,
  Space,
  message,
} from 'antd';

import {
  PlusCircleOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import validateMessages from '../common/form/ValidateMessages';

import { productConvert, customerConvert } from '../Adapters/DataConvert';

import {
  getData,
  addData,
  updateData,
  deleteData,
} from '../Adapters/FetchData';

import EditableCell from '../common/table/EditTableCell';
import InputType from '../common/table/InputType';
import SelectCustomer from '../common/form/SelectCustomer';

const { Option } = Select;

const AddOrderTable = () => {
  const [form] = Form.useForm();

  const [products, setProducts] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [customer, setCustomer] = useState({});

  const [total, setTotal] = useState(0);

  const [tempItems, setTempItems] = useState([]);

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

  const addCurrentProduct = async (key) => {
    try {
      await form.validateFields();
      let itemIndex = tempItems.findIndex((item) => item.key === key);
      const copyTempItems = [...tempItems];
      copyTempItems[itemIndex].isNew = false;
      console.log(copyTempItems);
      let total = 0;
      for (const item of copyTempItems) {
        if (!item.isNew) {
          total = total + item.total;
        }
      }
      setTotal(total);
      setTempItems(copyTempItems);
    } catch (error) {
      console.log('empty input');
    }
  };

  const decreaseCurrentProduct = (key) => {
    let newItems = [...tempItems].filter((item) => item.key !== key);
    let total = 0;
    for (const item of newItems) {
      total = total + item.total;
    }
    setTotal(total);
    setTempItems(newItems);
  };

  const selectCustomerHandler = (values) => {
    setCustomer(customers.find((item) => item.key === values));
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
      quantity: 1,
      price: 0,
      total: 0,
      desc: '',
      isNew: true,
    };
    setTempItems([...tempItems, { ...newItem }]);
  };

  const columns = [
    { title: 'Product', dataIndex: 'product', key: 'product', editable: true },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      editable: true,
    },
    { title: 'Price', dataIndex: 'price', key: 'price', editable: false },
    { title: 'Total', dataIndex: 'total', key: 'total', editable: false },
    { title: 'Notes', dataIndex: 'desc', key: 'desc', editable: true },
    {
      title: 'Action',
      dataIndex: '',
      key: '',
      render: (record) => {
        return (
          <Space>
            {record.isNew && (
              <Button
                type="primary"
                onClick={() => addCurrentProduct(record.key)}
              >
                <PlusCircleOutlined />
              </Button>
            )}
            <Button danger onClick={() => decreaseCurrentProduct(record.key)}>
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
      price: product.price,
      quantity: dataUpdate.quantity,
      total: product.price * dataUpdate.quantity,
    };
    copyItems[indexItemNeedUpdate] = newTempItems;
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
        getData: getDataHandler,
        dataSelect:
          column.dataIndex === 'product' ? { product: products } : null,
      }),
    };
  });

  const editAllItems = () => {
    const copyTempItems = [...tempItems];
    for (const item of copyTempItems) {
      item.isNew = true;
    }
    setTempItems(copyTempItems);
    setTotal(0);
  };

  const checkoutOrder = async () => {
    const url =
      'https://shop-management-aba6f-default-rtdb.firebaseio.com/test-orders.json';
    try {
      await form.validateFields();
      const listProducts = tempItems.map((item) => {
        return {
          key: item.product,
          date: new Date(),
          price: item.price,
          desc: item.desc,
          total: item.total,
        };
      });
      const orderData = {
        customerId: customer.key,
        products: listProducts,
      };
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      message.success('Add order completed');
    } catch (error) {
      console.log('Checkout error');
    }
  };

  return (
    <>
      <Form form={form} validateMessages={validateMessages} component={false}>
        <Row>
          <Col span={18}>
            <Row>
              <Form.Item
                name="customerId"
                label="Customer"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  style={{ width: 225 }}
                  placeholder="Search customer"
                  optionLabelProp="label"
                  optionFilterProp="children"
                  onChange={selectCustomerHandler}
                  filterOption={(input, option) =>
                    option.children.props.children[0].props.children[1]
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children.props.children[0].props.children[1]
                      .toLowerCase()
                      .localeCompare(
                        optionB.children.props.children[0].props.children[1].toLowerCase()
                      )
                  }
                >
                  {customers.map((customer) => {
                    return (
                      <Option
                        value={customer.key}
                        key={customer.key}
                        label={customer.name}
                      >
                        <div>
                          <span
                            style={{
                              display: 'inline-block',
                              marginLeft: 10,
                              width: 100,
                            }}
                          >
                            Name: {customer.name}
                          </span>
                          <span
                            style={{
                              display: 'inline-block',
                              marginLeft: 10,
                              width: 150,
                            }}
                          >
                            Phone: {customer.phone}
                          </span>
                          <span
                            style={{
                              display: 'inline-block',
                              marginLeft: 10,
                              width: 150,
                            }}
                          >
                            Birth: {customer.dateOfBirth}
                          </span>
                          <span
                            style={{
                              display: 'inline-block',
                              marginLeft: 10,
                              width: 100,
                            }}
                          >
                            Address: {customer.address}
                          </span>
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Row>
            <Row gutter={16}>
              <Col>
                <Card title="Customer" bordered={false} style={{ width: 300 }}>
                  <p>Name: {customer.name}</p>
                  <p>ID: {customer.key}</p>
                  <p>Phone: {customer.phone}</p>
                  <p>Birth: {customer.dateOfBirth}</p>
                  <p>Address: {customer.address}</p>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <br />
        <Row>
          <h4>Items: {tempItems.length}</h4>
        </Row>
        <Row>
          <h4>Total: {total}</h4>
        </Row>
        <Table
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
            <Space>
              <Button type="primary" onClick={editAllItems}>
                Edit
              </Button>
              <Button type="primary" onClick={checkoutOrder}>
                Checkout
              </Button>
            </Space>
          )}
        </div>
      </Form>
    </>
  );
};

export default AddOrderTable;
