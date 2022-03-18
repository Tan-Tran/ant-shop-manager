import React, { useState } from 'react';
import {Modal, Form, Button} from 'antd'

import CustomerForm from '../form/CustomerForm'
import moment from 'moment';

import formatDate from '../../format/formatDate'

const ModalCustomer = props =>{

    const [form] = Form.useForm();

    const{title, customer={}, handleSubmit, type, descBtn} = props

    const [isVisible, setIsVisible] = useState(false)

    const showModal = () =>{
        setIsVisible(true)
    }

    const handleCancel = () =>{
        setIsVisible(false)
    }

    const handleSave = (values) =>{
        const newData = {
            key: customer?.key,
            age: values.age,
            name: values.name,
            address: values.address,
            dateOfBirth: moment( values.birth).format(formatDate)
        }
        handleSubmit(newData)
        setIsVisible(false)
    }

    return(
        <>
            <Button type={type} onClick={showModal}>{descBtn}</Button>
            <Modal title ={`${title} Customer`} visible={isVisible} onOk={form.submit} onCancel={handleCancel}>
                 <CustomerForm form={form} customer={customer} handleSave={handleSave}/>
            </Modal>
        </>
    )

}

export default ModalCustomer;