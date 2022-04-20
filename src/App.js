import React from 'react';
import ShopHeader from './layout/header/Header';
import ShopSidebar from './layout/sidebar/Sidebar';
import Customer from './pages/Customer';
import Product from './pages/Product';
import Order from './pages/Order/view';
import AddOrder from './pages/Order/new';
import UpdateOrder from './pages/Order/update';
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import 'antd/dist/antd.css';
const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Header>
            <ShopHeader />
          </Header>
          <Layout style={{height:"100vh"}}>
            <ShopSidebar />
            <Content>
              <Switch>
                <Route path="/" exact>
                  <Customer />
                </Route>
                <Route path="/customer" exact>
                  <Customer />
                </Route>
                <Route path="/product" exact>
                  <Product />
                </Route>
                <Route path="/order" exact>
                  <Order />
                </Route>
                <Route path="/order/new">
                  <AddOrder />
                </Route>
                <Route path="/order/:id">
                  <UpdateOrder />
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
