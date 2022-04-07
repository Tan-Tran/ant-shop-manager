import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Popconfirm, Typography, Space, Button, message } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';
import EditTable from '../common/table/EditTable';
import { FormatDate_DD_MM_YYY } from '../format/date/FormatDate';
import { getAllCustomers, updateCustomer, addCustomer, deleteCustomer } from '../api/CustomerApi';
import moment from 'moment';


const OrderRefactors = () =>{
    const [form] = Form.useForm()

    const columns = [
        
    ]

    return(
        <EditTable/>
    )
}