import React from 'react';
import {Layout, Menu} from 'antd'

import './sidebar.css'
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons';

const {Sider} = Layout
const AppSideBar = props =>{
    return(
        <Sider trigger={null} className="sidebar-container">
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                    Customer
                </Menu.Item>
                <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                    Product
                </Menu.Item>
                <Menu.Item key="3" icon={<UploadOutlined />}>
                    Order
                </Menu.Item>
            </Menu>
        </Sider>
    )
}

export default AppSideBar

