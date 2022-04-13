import React, { useState, useEffect } from 'react';
import {Form,Input,Button,InputNumber,Select,Row,Divider,message,} from 'antd';
import EditTable from '../common/table/EditTable';
import AddNewRowButton from '../common/table/button/AddNewRowButton';
import { getAllProducts } from '../api/ProductApi';
import { getAllCustomers } from '../api/CustomerApi';
import CustomerInfo from '../order/CustomerInfo';
import SelectCustomer from '../order/SelectCustomer';
import { FormatDate_DD_MM_YYY } from '../format/date/FormatDate';
import moment from 'moment';
import { useHistory, useParams } from 'react-router-dom';
import validateMessages from '../common/form/ValidateMessages';
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
          data['products'].map((product) => {
            return {
              key: product.productId,
              productId: product.productId,
              quantity: product.quantity,
              price: product.price,
              total: product.total,
              desc: product.desc,
            };
          })
        );
        setTotalCostOrder(
          data['products'].reduce((prev, current) => prev + current.total, 0)
        );
      });
    }
  }, [id, customers, products]);

  const checkDuplicate = (currentProductId, data) =>{
    const recordKeys = Object.keys(data)
    const productIds = recordKeys.map((key) => {return data[key]?.productId})
    return productIds.filter((key) => key === currentProductId).length > 1? true: false
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
          (form) => ({validator(_,value){
            if(value === undefined) {
              return Promise.reject(new Error('Product is required!'));
            }
            if(checkDuplicate(value, form.getFieldsValue())){
              return Promise.reject(new Error('Product is duplicated!'));
            }
            return Promise.resolve()
          }})
        ],
        style: {
          width: '100%',
        },
      },
      width: '200px'
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
        style: {
          width: '50%',
        },
      },
      width: '400px'
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
      width: '200px'
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
      width: '200px'
    },
  ];

  const addNewRow = () => {
    let newData = {
      key: Date.now(),
      productId: undefined,
      quantity: 1,
      price: 0,
      total: 0,
      desc: '',
      isNew: true,
    };
    setProductsOfOrder([...productsOfOrder, { ...newData }]);
  };

  const selectCustomer = (key) => {
    const customer = customers.find((customer) => customer.key === key);
    setCustomer(customer);
    formOrderPage.setFieldsValue({
      delivery: customer.address,
    });
  };

  const onCancel = async (record) => {
    const products = [...productsOfOrder].filter(
      (item) => item.key !== record.key
    );
    setProductsOfOrder(products);
    setTotalCostOrder(products.reduce((prev, current) => prev + current.total, 0));
  };

  const checkoutOrder = async () => {
    await formProductsOrderTable.validateFields()
    await formOrderPage.validateFields();
    const dataSave = {
      customerId: customer.key,
      customerName: customers.find((item) => item.key === customer.key).name,
      delivery: formOrderPage.getFieldValue('delivery'),
      createAt: new Date(),
      products: productsOfOrder.map((product) => {
        return {
          productId: product.productId,
          productName: products.find((item) => item.key === product.productId).name,
          price: product.price,
          quantity: product.quantity,
          total: product.total,
          desc: product.desc,
        };
      }),
    };
    if (!id) {
      await addOrder(dataSave).
        then(() => history.push('/order')).
        then(() => message.success("Complete add new order"));
    } else {
      await updateOrder(id, dataSave).
        then(() => history.push('/order')).
        then(() => message.success("Update order complete"))
        ;
    }
  };

  const onChangeProductsOrderTable = async (allRecord) => {
    await formProductsOrderTable.validateFields()
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
        price: productId? products.find((item) => item.key === productId).price: 0,
        total: productId? record.quantity * products.find((item) => item.key === productId).price: 0,
        desc: record.desc,
      };
    }
    setProductsOfOrder(copyProductsOrder);
    setTotalCostOrder(copyProductsOrder.reduce((prev, current) => prev + current.total, 0));
  };

  return (
    <div style={{ padding: 16 }}>
      <Form form={formOrderPage} component={false} validateMessages={validateMessages}>
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
        <Form.Item name="productsOfOrder">
          <EditTable
            formOutside ={formOrderPage}
            type="multiple"
            columns={columns}
            dataSource={productsOfOrder}
            pagination={false}
            onCancel={(record) => onCancel(record)}
            onChange={(record) => onChangeProductsOrderTable(record)}
          />
        </Form.Item>
      </Form>
      <AddNewRowButton addNewRow={addNewRow} title={'Add new order'}/>
      <div className="add-icon">
        <Button type="primary" htmlType="submit" onClick={checkoutOrder}>
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default AddOrderRefactor;
