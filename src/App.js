import './App.css';
import ShopHeader from './components/common/Header';
import ShopSidebar from './components/common/Sidebar';
import Customer from './components/pages/Customer';
import CustomerRefactor from './components/pages/CustomerRefactor';
import Product from './components/detail/Product';
import ProductRefactors from './components/pages/ProductRefactor';
import Order from './components/detail/Order';
import OrderRefactor from './components/pages/OrderRefactor';

import AddOrder from './components/pages/AddOrder';
import AddOrderRefactor from './components/pages/AddOrderRefactor';

import 'antd/dist/antd.css';
import { Layout } from 'antd';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React from 'react';

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <div className="App">
        <React.Fragment>
          <Layout>
            <Header>
              <ShopHeader />
            </Header>
            <Layout>
              <ShopSidebar />
              <Content>
                <Switch>
                  <Route path="/" exact>
                    <CustomerRefactor />
                  </Route>

                  <Route path="/customer" exact>
                    <CustomerRefactor />
                  </Route>

                  <Route path="/product" exact>
                    <ProductRefactors />
                  </Route>

                  <Route path="/order" exact>
                    <OrderRefactor />
                  </Route>

                  <Route path="/order/new">
                    <AddOrderRefactor />
                  </Route>

                  <Route path="/order/:id">
                    <AddOrderRefactor />
                  </Route>
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </React.Fragment>
      </div>
    </Router>
  );
}

export default App;
