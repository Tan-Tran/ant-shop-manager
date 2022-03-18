import React,{useEffect} from 'react';
import {Form, InputNumber, Input, Button} from 'antd'
import {DatePicker} from 'antd'
import moment from 'moment'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams
} from "react-router-dom";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };
  
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

const formatDate = 'DD/MM/YYYY'

const CustomerDetail = props =>{

    const {customers} = props

    const {id} = useParams()

    console.log(customers[id])
    return(
        <div>
            
        </div>
    )
}
export default CustomerDetail