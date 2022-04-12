import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Popconfirm,
  Typography,
  Space,
  Button,
  message,
  InputNumber,
  Select,
  Row,
  Divider,
} from 'antd';
import EditTableWithAddButton from '../common/table/EditTableWithAddButton';
import { getAllProducts } from '../api/ProductApi';
import { getAllCustomers } from '../api/CustomerApi';
import CustomerInfo from '../order/CustomerInfo';
import SelectCustomer from '../order/SelectCustomer';
import { FormatDate_DD_MM_YYY } from '../format/date/FormatDate';
import moment from 'moment';

import { useParams } from 'react-router-dom';
import validateMessages from '../common/form/ValidateMessages';

const AddOrderRefactor = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [totalCostOrder, setTotalCostOrder] = useState(0);
  const [productsOfOrder, setProductsOfOrder] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    getAllProducts().then((data) =>
      setProducts(
        Object.keys(data).map((key) => {
          return {
            key: key,
            name: data[key].name,
            price: data[key].price,
            quantity: data[key].quantity,
            desc: data[key].desc,
            origin: data[key].origin,
          };
        })
      )
    );
  }, []);

  useEffect(() => {
    getAllCustomers().then((data) =>
      setCustomers(
        Object.keys(data).map((key) => {
          return {
            key: key,
            name: data[key].name,
            address: data[key].address,
            dateOfBirth: moment(data[key].dateOfBirth).format(
              FormatDate_DD_MM_YYY
            ),
            phone: data[key].phone,
          };
        })
      )
    );
  }, []);

  // const remove = (key) => {
  //   setProductsOfOrder([...productsOfOrder].filter((item) => item.key !== key));
  // };

  const updateDataProductsOfOrder = ({ key, value, field }) => {
    const product = products.find((item) => item.key === value);
    const copyProductsOrder = [...productsOfOrder];
    const indexProductOrder = productsOfOrder.findIndex(
      (product) => product.key === key
    );
    let productOrderUpdate = {
      ...[...productsOfOrder][indexProductOrder],
      [`${field}`]: value,
      price: product?.price,
      total:
        (productsOfOrder.quantity ? productsOfOrder.quantity : 1) *
        product.price,
    };
    // if(field === "productId"){
    //   const product = products.find((item) => item.key === value);
    //   productOrderUpdate = {
    //     ...[...productsOfOrder][indexProductOrder],
    //     price: product?.price,
    //     total: (productsOfOrder.quantity? productsOfOrder.quantity: 1) * product.price,
    // }
    // if(field === 'quantity'){
    //   productOrderUpdate = {
    //     ...[...productsOfOrder][indexProductOrder],
    //     quantity: value,
    // }
    // const { productId, quantity } = form.getFieldValue(key);
    // const productFireBase = products.find(
    //   (product) => product.key === productId
    // );

    // const productOrderUpdate = {
    //   ...[...productsOfOrder][indexProductOrder],
    //   [`${field}`]: value,
    //   productId: product.productId,
    //   quantity: product.quantity,
    //   price: product?.price,
    //   total: productsOfOrder?.quantity * product?.price,
    // };
    console.log(productOrderUpdate);
    copyProductsOrder[indexProductOrder] = productOrderUpdate;
    // setProductsOfOrder(copyProductsOrder);
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
          {
            required: true,
            message: 'Product is required',
          },
          {},
        ],
        style: {
          width: '100%',
        },
      },
      style: {
        width: '20%',
      },
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
        initialValue: 1,
        rules: [
          {
            required: true,
            message: 'Quantity is required',
          },
        ],
        style: {
          width: '50%',
        },
      },
      style: {
        width: '20%',
      },
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
      style: {
        width: '20%',
      },
    },
    {
      title: 'Notes',
      dataIndex: 'desc',
      inputType: Input,
      editable: true,
      formItemProps: {
        style: {
          width: '50%',
        },
      },
      style: {
        width: '20%',
      },
    },
  ];

  const selectCustomer = (key) => {
    const customer = customers.find((customer) => customer.key === key);
    setCustomer(customer);
    form.setFieldsValue({
      delivery: customer.address,
    });
  };

  const checkoutOrder = () => {
    const dataSave = {
      customerId: customer.key,
      customerName: customer.name,
      delivery: form.getFieldValue('delivery'),
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
  };

  return (
    <div style={{ padding: 16 }}>
      <Form form={form} component={false} validateMessages={validateMessages}>
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
      </Form>
      <Row>
        <h4>Items: {productsOfOrder.length}</h4>
        <Divider type="vertical" />
        <h4>Total: {totalCostOrder}</h4>
      </Row>
      <EditTableWithAddButton
        type="multiple"
        columns={columns}
        dataSource={productsOfOrder}
        pagination={false}
        onEdit={({ key, value, field }) =>
          updateDataProductsOfOrder({ key, value, field })
        }
      />
      <div className="add-icon">
        {productsOfOrder.length > 0 && (
          <Button type="primary" onClick={checkoutOrder}>
            Checkout
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddOrderRefactor;
