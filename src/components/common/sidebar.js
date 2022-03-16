import React from 'react';
import {Layout, Menu} from 'antd'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
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
        <Router>
            <Sider trigger={null} className="sidebar-container">
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        {/* Customer */}
                        <Link to="/customer">Customer</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                        Product
                        {/* <Link to="/product">Product</Link> */}
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UploadOutlined />}>
                        Order
                        {/* <Link to="/order">Order</Link> */}
                    </Menu.Item>
                </Menu>
            </Sider>
        </Router>
    )
}

export default AppSideBar

