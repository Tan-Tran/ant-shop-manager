import React, { useEffect, useState } from 'react';
import { Row, Col, Select } from 'antd';
import Span from './Span';
import CustomerInfo from './CustomerInfo';

const { Option } = Select;

const SelectCustomer = ({customer, customers, onChange}) => {
  const[customerSelect, setCustomer] = useState(null)
  const [customerId, setCustomerId] = useState('')

  useEffect(() =>{
    if(customer){
      setCustomer(customers[customer.key])
      setCustomerId(customer.key)
    }
  },[customer])

  const selectCustomer = (customerId) =>{
    setCustomer(customers[customerId])
  }
  
  return (
    <Row>
      <Col>
          <Select
            value={customerId || ''}
            showSearch
            style={{ width: 300 }}
            placeholder="Search customer"
            optionLabelProp="label"
            optionFilterProp="children"
            onChange={(value) => {
              setCustomerId(value)
              onChange(value)
              selectCustomer(value)
            }}
            filterOption={(input, option) =>option.children.props.children[0].props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0}
            filterSort={(optionA, optionB) =>optionA.children.props.children[0].props.children[1].toLowerCase().localeCompare(optionB.children.props.children[0].props.children[1].toLowerCase())}
          >
            {Object.values(customers)?.map((customer) => {
              return (
                <Option value={customer.key} key={customer.key} label={customer.name}>
                  <div>
                    <Span>Name: {customer.name}</Span>
                    <Span>Phone: {customer.phone}</Span>
                    <Span>Birth: {customer.dateOfBirth}</Span>
                    <Span>Address: {customer.address}</Span>
                  </div>
                </Option>
              );
            })}
          </Select>
          <CustomerInfo customer={customerSelect}/>
      </Col>
    </Row>
  );
};

export default SelectCustomer;