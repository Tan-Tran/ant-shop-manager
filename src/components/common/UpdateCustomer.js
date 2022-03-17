import React, { useState } from 'react';
import {Modal, Form, Button} from 'antd'

import ModalCustomer from './ModalCustomer'

const UpdateCustomer = ({user, handleUpdate}) =>{
    
    const [form] = Form.useForm()

    const{key} = user

    const[isVisible, setIsVisible]= useState(false)

    const handleSubmit = (values) =>{
        const newData = {
            key: key,
            name: values.name,
            age: values.age,
            address: values.address,
            dateOfBirth: values.birth['_d'].toLocaleDateString('en-GB'),
        }
        setIsVisible(false)
        handleUpdate(newData)
    }

    const showModal = () =>{
        setIsVisible(true)
    }

    const handleCancel = () =>{
        setIsVisible(false)
    }

    return(
        <>
            <Button type="primary" onClick={showModal}>Update</Button>
            <Modal title="Update Customer" visible={isVisible} onOk={form.submit} okText="Save" onCancel={handleCancel}>
                <ModalCustomer form={form} handleSubmit={handleSubmit} user={user}/>
            </Modal>
        </>
    )
}

export default UpdateCustomer