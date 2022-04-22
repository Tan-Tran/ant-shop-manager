import React, { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
import { Form, Input, Button, InputNumber, Select, message,} from 'antd';
import EditTable from '../../../components/table/EditTable';
import SelectCustomer from './SelectCustomer';
import { addOrder, getOrder, updateOrder } from '../../../api/OrderApi';
import { getAllProducts } from '../../../api/ProductApi';
import { getAllCustomers } from '../../../api/CustomerApi';
import moment from 'moment';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  useHistory
} from "react-router-dom";

const OrderForm = (props) => {
  const {orderId} = props
  const history = useHistory();
  const [formOrderPage] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [productsOfOrder, setProductsOfOrder] = useState([]);
  const [formProducts] = Form.useForm();
  let { url } = useRouteMatch();

  useEffect(() => {
    getAllProducts().then(setProducts);
    getAllCustomers().then(setCustomers);
  }, []);

  useEffect(() =>{
    if(orderId && customers && products){
      getOrder(orderId).then((data) => {
        const {customer, delivery, orderItemsList} = data
        formOrderPage.setFieldsValue({
          customerId: customer?.id,
          delivery: delivery,
        });
        setCustomer(customersJson[customer?.id]);
        setProductsOfOrder(orderItemsList?.map((product) => {
            return {
              key: product.id,
              id: product.id,
              productId: product.productId,
              ...product,
            };
          })
        );
      });
    }
  },[orderId, customers, products])

  const productsJson = products.reduce((map, product) => {
    map[product.key] = product
    return map
  },{})

  const customersJson = customers.reduce((map, customer) => {
    map[customer.key] = customer
    return map
  },{})


  const isEmptyProduct = (id) =>{
    return id === '' || id === undefined
  }

  const isDuplicateProduct = (id) =>{
    const data = formProducts.getFieldsValue()
    const productIds = Object.values(data).map((item) => {return item.productId})
    return productIds.filter((productId) => productId === id).length > 1? true: false
  }

  const checkProduct = (productId) => {
    if(isEmptyProduct(productId)){
      return Promise.reject(new Error('Product is required!'));
    }
    if(isDuplicateProduct(productId)){
      
      return Promise.reject(new Error(`${productsJson[productId].name.toUpperCase()} is duplicated!`));
    }
    return Promise.resolve()
  };

  const isEmptyProductsOrder = () => {
    return Object.keys(formOrderPage.getFieldValue('productsOfOrder')).length === 0? true: false
  }

  const checkProducts = () =>{
    if(isEmptyProductsOrder()){
      return Promise.reject(new Error("Product is required"))
    }
    return Promise.resolve()
  }

  const isEmptyCustomer = () =>{
    const customerId = formOrderPage.getFieldValue("customerId")
    return customerId === '' || customerId === undefined
  }

  const checkCustomer = () =>{
    if(isEmptyCustomer()){
      return Promise.reject(new Error("Customer is required"))
    }
    return Promise.resolve();
  }

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
          {validator:(_,value) => checkProduct(value)},
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
        initialValue: 1,
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
      render:(_, record) =>{
        return <p>{productsJson[record.productId]?.price || 0}</p>
      }
    },
    {
      title: 'Total',
      dataIndex: 'total',
      editable: false,
      width: '200px',
      render:(_, record) =>{
        return <p>{(productsJson[record.productId]?.price || 0) * (record?.quantity || 0)}</p>
      }
    },
    {
      title: 'Notes',
      dataIndex: 'description',
      inputType: Input,
      editable: true,
      width: '200px',
    },
  ];

  const validateOrderPage = async () =>{
    await formOrderPage.validateFields();
    await formProducts.validateFields();
  }

  const dataOrderPage = () =>{
    const {customerId, delivery, productsOfOrder} = formOrderPage.getFieldsValue()
    const customer = customersJson[customerId]
    const productsOrderData = Object.keys(productsOfOrder).map((key) =>{
        return {
          id: !key.includes("new")? parseInt(key): '',
          productId: productsOfOrder[key].productId,
          name: productsJson[productsOfOrder[key].productId].name,
          price: productsJson[productsOfOrder[key].productId].price,
          quantity: productsOfOrder[key].quantity,
          description: productsOfOrder[key].description,
          total: productsJson[productsOfOrder[key].productId].price * productsOfOrder[key].quantity,
      }     
    })
    const data = {
      customerDTO: {...customer, dateOfBirth: moment(customer.dateOfBirth, "DD/MM/YYYY").toDate(),},
      delivery: delivery,
      createAt: new Date(),
      orderItemsList: productsOrderData,
    }
    return data
  }

  const checkoutOrder = async () => {
    await validateOrderPage()
    const data = dataOrderPage()
    if(!orderId){
      addOrder(data)
        .then(() => history.push('/order'))
        .then(() => message.success('Complete add new order'));
        return
    }
    updateOrder(orderId, data)
        .then(() => history.push('/order'))
        .then(() => message.success('Update order complete'));
  };

  return (
    <div style={{ padding: 16 }}>
      <Form form={formOrderPage} onFinish={checkoutOrder}>
        <Form.Item name="customerId" rules={[{validator: checkCustomer}]}>
          <SelectCustomer customers={customersJson} customer = {customer} form={formOrderPage}
            onChange={(value) => formOrderPage.setFieldsValue({customerId: value}) }/>
        </Form.Item>
        <Form.Item  style ={{width: '300px'}} name="delivery" label="Delivery to" rules={[{required: true, message: 'Delivery is required.'}]}>
          <Input />
        </Form.Item>
        <Form.Item name="productsOfOrder" rules={[{validator: checkProducts}]}>
          <EditTable 
            type="multiple" 
            formOutside={formProducts} 
            columns={columns} 
            dataSource={productsOfOrder} 
            pagination={false} 
            onChange={(values) => formOrderPage.setFieldsValue({productsOfOrder: values})}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Checkout
          </Button>
        </Form.Item>
      </Form>
      {orderId && <Link to={`${url}/pdf`}>Print PDF</Link>}
    </div>
  );
};

export default OrderForm;
