import React from 'react';
import {Layout, Menu} from 'antd'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
  } from "react-router-dom";

import './Sidebar.css'

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
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['']}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                    <Link to="/customer">Customer</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                    <Link to="/product">Product</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<UploadOutlined />}>
                    <Link to="/order">Order</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    )
}

export default AppSideBar

