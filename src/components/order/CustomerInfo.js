import React from 'react';
import { Row, Col, Card } from 'antd';

const CustomerInfo = ({ customer }) => {
  return (
    <Row>
      <Col>
        <Card title="Customer Info" bordered={false} style={{ width: 300 }}>
          <p>Name: {customer?.name}</p>
          <p>ID: {customer?.key}</p>
          <p>Phone: {customer?.phone}</p>
          <p>Birth: {customer?.dateOfBirth}</p>
          <p>Address: {customer?.address}</p>
        </Card>
      </Col>
    </Row>
  );
};

export default CustomerInfo;
