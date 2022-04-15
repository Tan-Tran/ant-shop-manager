import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  Row,
  Divider,
  message,
} from 'antd';
import EditTable from '../common/table/EditTableFinal';
import { getAllProducts } from '../api/ProductApi';
import { getAllCustomers } from '../api/CustomerApi';
import CustomerInfo from '../order/CustomerInfo';
import SelectCustomer from '../order/SelectCustomer';
import { useHistory, useParams } from 'react-router-dom';
import { getOrder, addOrder, updateOrder } from '../api/OrderApi';

const AddOrderRefactor = () => {
  const history = useHistory();
  const [formOrderPage] = Form.useForm();
  const [products, setProducts] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [totalCostOrder, setTotalCostOrder] = useState(0);
  const [productsOfOrder, setProductsOfOrder] = useState([]);
  const { id } = useParams();
  const [formProductsOrderTable] = Form.useForm();

  useEffect(() => {
    getAllProducts().then(setProducts);
    getAllCustomers().then(setCustomers);
  }, []);

  useEffect(() => {
    if (id && customers && products) {
      getOrder(id).then((data) => {
        formOrderPage.setFieldsValue({
          delivery: data['delivery'],
        });
        setCustomer(
          customers.find((customer) => customer.key == data['customerId'])
        );
        setProductsOfOrder(
          data['products']
            ? data['products']?.map((product) => {
                return {
                  key: product.productId,
                  ...product,
                };
              })
            : []
        );
        setTotalCostOrder(
          data['products']
            ? data['products'].reduce(
                (prev, current) => prev + current.total,
                0
              )
            : 0
        );
      });
    }
  }, [id, customers, products]);

  const checkDuplicate = (currentProductId, data) => {
    const recordKeys = Object.keys(data);
    const productIds = recordKeys.map((key) => {
      return data[key]?.productId;
    });
    return productIds.filter((key) => key === currentProductId).length > 1
      ? true
      : false;
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'productId',
      editable: true,
      inputType: Select,
      elementProps: {
        placeholder: 'Select product',
        options: products?.map((product) => {
          return {
            label: product.name,
            value: product.key,
          };
        }),
      },
      formItemProps: {
        rules: [
          (form) => ({
            validator(_, value) {
              if (value === undefined) {
                return Promise.reject(new Error('Product is required!'));
              }
              if (checkDuplicate(value, form.getFieldsValue())) {
                return Promise.reject(new Error('Product is duplicated!'));
              }
              return Promise.resolve();
            },
          }),
        ],
      },
      width: '200px',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      inputType: InputNumber,
      editable: true,
      elementProps: {
        min: 1,
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Quantity is required',
          },
        ],
      },
      width: '400px',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      editable: false,
      style: {
        width: '20%',
      },
    },
    {
      title: 'Total',
      dataIndex: 'total',
      editable: false,
      width: '200px',
    },
    {
      title: 'Notes',
      dataIndex: 'desc',
      inputType: Input,
      editable: true,
      width: '200px',
    },
  ];

  const selectCustomer = (key) => {
    const customer = customers.find((customer) => customer.key === key);
    setCustomer(customer);
    formOrderPage.setFieldsValue({
      delivery: customer.address,
    });
  };

  const checkoutOrder = async () => {
    await formProductsOrderTable.validateFields();
    await formOrderPage.validateFields();
    const dataSave = {
      customerId: customer.key,
      customerName: customers.find((item) => item.key === customer.key).name,
      delivery: formOrderPage.getFieldValue('delivery'),
      createAt: new Date(),
      products: productsOfOrder.map((product) => {
        return {
          productId: product.productId,
          productName: products.find((item) => item.key === product.productId)
            .name,
          price: product.price,
          quantity: product.quantity,
          total: product.total,
          desc: product.desc,
        };
      }),
    };
    if (!id) {
      addOrder(dataSave)
        .then(() => history.push('/order'))
        .then(() => message.success('Complete add new order'));
    } else {
      updateOrder(id, dataSave)
        .then(() => history.push('/order'))
        .then(() => message.success('Update order complete'));
    }
  };

  const onChangeProductsOrderTable = async (allRecord) => {
    await formProductsOrderTable.validateFields();
    const keys = Object.keys(allRecord);
    const copyProductsOrder = [...productsOfOrder];
    for (const key of keys) {
      const record = allRecord[key];
      const productId = record.productId;
      const productIndex = productsOfOrder.findIndex((item) => item.key == key);
      copyProductsOrder[productIndex] = {
        ...copyProductsOrder[productIndex],
        productId: productId,
        quantity: record.quantity,
        price: productId
          ? products.find((item) => item.key === productId).price
          : 0,
        total: productId
          ? record.quantity *
            products.find((item) => item.key === productId).price
          : 0,
        desc: record.desc,
      };
    }
    setProductsOfOrder(copyProductsOrder);
    setTotalCostOrder(
      copyProductsOrder.reduce((prev, current) => prev + current.total, 0)
    );
  };

  return (
    <div style={{ padding: 16 }}>
      <Form form={formOrderPage} component={false}>
        <SelectCustomer
          id={id}
          customers={customers}
          onSelect={selectCustomer}
        />
        <CustomerInfo customer={customer} />
        <br />
        <Row>
          <Form.Item
            style={{ width: '300px' }}
            name="delivery"
            label="Delivery to"
            rules={[
              {
                required: true,
                message: 'Delivery is required.',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Row>
        <Row>
          <h4>Items: {productsOfOrder.length}</h4>
          <Divider type="vertical" />
          <h4>Total: {totalCostOrder}</h4>
        </Row>
        <Form.Item
          name="productsOfOrder"
          rules={[{ required: true, message: 'Product is required' }]}
        >
          <EditTable
            type="multiple"
            formOutside={formProductsOrderTable}
            columns={columns}
            dataSource={productsOfOrder}
            pagination={false}
            onChange={(record) => onChangeProductsOrderTable(record)}
          />
        </Form.Item>
      </Form>
      <div className="add-icon">
        <Button type="primary" htmlType="submit" onClick={checkoutOrder}>
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default AddOrderRefactor;
