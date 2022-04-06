import './App.css';
import ShopHeader from './components/common/Header'
import ShopSidebar from './components/common/Sidebar'
import Customer from './components/pages/Customer'
import CustomerRefactor from './components/pages/CustomerRefactor'
import Product from './components/detail/Product'
import Order from './components/detail/Order'

import AddOrder from './components/pages/AddOrder'

import 'antd/dist/antd.css'
import {Layout} from 'antd'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import React from 'react';


const {Header, Content} = Layout

function App() {

  return (
    <Router>
        <div className="App">          
            <React.Fragment>              
              <Layout>
                <Header>
                  <ShopHeader/>
                </Header>
                <Layout>
                  <ShopSidebar/>
                  <Content>
                    <Switch>
                      <Route path="/" exact>
                        <CustomerRefactor/>
                      </Route>

                      <Route path="/customer" exact>
                        <CustomerRefactor/>
                      </Route>

                      <Route path="/product" exact>
                        <Product/>
                      </Route>

                      <Route path="/order" exact>
                        <Order/>
                      </Route>

                      <Route path="/order/new">
                        <AddOrder/>
                      </Route>

                      <Route path="/order/:id">
                        <AddOrder/>
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
