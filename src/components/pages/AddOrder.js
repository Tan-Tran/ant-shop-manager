import React, { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, Select, Row, message,} from 'antd';
import EditTable from '../../common/table/EditTable';
import { getAllProducts } from '../../api/ProductApi';
import { getAllCustomers } from '../../api/CustomerApi';
import CustomerInfo from '../order/CustomerInfo';
import SelectCustomer from '../order/SelectCustomer';
import { useHistory, useParams } from 'react-router-dom';
import { getOrder, addOrder, updateOrder } from '../../api/OrderApi';

const AddOrderRefactor = () => {
  const history = useHistory();
  const [formOrderPage] = Form.useForm();
  const [products, setProducts] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [customer, setCustomer] = useState(null);
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
          customerId: data['customerId'],
          delivery: data['delivery'],
        });
        setCustomer(customers.find((customer) => customer.key == data['customerId']));
        setProductsOfOrder(data['products'].map((product) => {
            return {
              key: product.key,
              productId: product.key,
              ...product,
            };
          })
        );
      });
    }
  }, [id, customers, products]);

  const validateProductsOrder = (productId) => {
    if(!productId){
      return Promise.reject(new Error('Product is required!'));
    }
    const data = formProductsOrderTable.getFieldsValue()
    const productIds = Object.keys(data).map((key) => {return data[key]?.productId})
    if(productIds.filter((key) => key === productId).length > 1){
      return Promise.reject(new Error('Product is duplicated!'));
    }
    return Promise.resolve()
  };

  const validateProductsOrderTable = () =>{
    const data = formProductsOrderTable.getFieldsValue();
    console.log(data)
    if(Object.keys(data).length === 0){
      return Promise.reject(new Error("Product is required"))
    }
    return Promise.resolve()
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
          {validator:(_,value) => validateProductsOrder(value)},
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
        const product = products.find((item) => item.key === record.productId)
        return <p>{product?.price || 0}</p>
      }
    },
    {
      title: 'Total',
      dataIndex: 'total',
      editable: false,
      width: '200px',
      render:(_, record) =>{
        const product = products.find((item) => item.key === record.productId)
        return <p>{(product?.price || 0) * record.quantity}</p>
      }
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
      customerId: customer.key,
      delivery: customer.address,
    });
  };

  const checkoutOrder = async () => {
    await formOrderPage.validateFields();
    await formProductsOrderTable.validateFields();
    const {customerId, delivery} = formOrderPage.getFieldsValue()
    const dataProductsOrderTable = formProductsOrderTable.getFieldsValue()
    const productsOrder = Object.keys(dataProductsOrderTable).map((key) => {
      const product = products.find((item) => item.key ==(dataProductsOrderTable[key].productId))
      return{
        ...product,
        quantity: dataProductsOrderTable[key].quantity,
        total: product.price * dataProductsOrderTable[key].quantity,
        desc: dataProductsOrderTable[key].desc,
      }
    })
    const data = {
      customerId: customerId,
      delivery: delivery,
      customerName: customer.name,
      createAt: new Date(),
      products: productsOrder
    }
    if (!id) {
      addOrder(data)
        .then(() => history.push('/order'))
        .then(() => message.success('Complete add new order'));
    } else {
      updateOrder(id, data)
        .then(() => history.push('/order'))
        .then(() => message.success('Update order complete'));
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <Form form={formOrderPage} component={false}>
        <Form.Item name="customerId" rules={[{required: true, message: 'Customer is required'}]}>
          <SelectCustomer customers={customers} onSelect={selectCustomer}/>
        </Form.Item>
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
        <Form.Item
          name="productsOfOrder"
          rules={[{ validator: validateProductsOrderTable}]}
        >
          <EditTable
            type="multiple"
            formOutside={formProductsOrderTable}
            columns={columns}
            dataSource={productsOfOrder}
            pagination={false}
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
