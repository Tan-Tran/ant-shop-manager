import React from 'react';
import { Row, Col, Card } from 'antd';

const CustomerInfo = ({ customer }) => {
  return (
    <Card title="Customer Info" bordered={false} style={{ width: 300, marginTop: '20px' }}>
      <p>Name: {customer?.name}</p>
      <p>ID: {customer?.key}</p>
      <p>Phone: {customer?.phone}</p>
      <p>Birth: {customer?.dateOfBirth}</p>
      <p>Address: {customer?.address}</p>
    </Card>
  );
};

export default CustomerInfo;
