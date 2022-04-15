import React from 'react';
import { Row, Col, Form, Select } from 'antd';

const { Option } = Select;

const SelectCustomer = ({ id, customers, onSelect }) => {
  return (
    <Row>
      <Col>
        {!id && (
          <Form.Item
            name="customer"
            rules={[{ required: true, message: 'Customer is required' }]}
          >
            <Select
              showSearch
              style={{ width: 300 }}
              placeholder="Search customer"
              optionLabelProp="label"
              optionFilterProp="children"
              onSelect={onSelect}
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
              {customers?.map((customer) => {
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
        )}
      </Col>
    </Row>
  );
};

export default SelectCustomer;
