import React, { useState } from 'react';
import {Modal, Form, Button} from 'antd'

import ModalCustomer from './ModalCustomer';

import {UserAddOutlined} from '@ant-design/icons';

const AddCustomer = ({handleAdd}) =>{

    const [form] = Form.useForm()

    const[isVisible, setIsVisible] = useState(true)

    const showModal = () =>{
        setIsVisible(true)
    }

    const handleCancel = () =>{
        setIsVisible(false)
    }

    const handleSubmit = (values) =>{
        handleAdd(values)
        form.resetFields();
        setIsVisible(false)
    }

    return (
        <>
            {/* <Button type="primary" onClick={showModal}><UserAddOutlined />Add new customer</Button> */}
            <Modal title="Add Customer" visible={isVisible} onOk={form.submit} okText="Save" onCancel={handleCancel}>
                <ModalCustomer form={form} handleSubmit={handleSubmit}/>
            </Modal>
        </>
    )
}

export default AddCustomer