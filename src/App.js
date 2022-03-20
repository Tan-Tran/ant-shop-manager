import './App.css';
import ShopHeader from './components/common/Header'
import ShopSidebar from './components/common/Sidebar'
import Customer from './components/detail/Customer'
import Product from './components/detail/Product'
import Order from './components/detail/Order'

import AddCustomer from './components/pages/AddCustomer'
import CustomerDetail from './components/pages/CustomerDetail'

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
                        <Customer/>
                      </Route>

                      <Route path="/customer" exact>
                        <Customer/>
                      </Route>

                      <Route path="/product" exact>
                        <Product/>
                      </Route>

                      <Route path="/order" exact>
                        <Order/>
                      </Route>

                      <Route path="/add-customer">
                        <AddCustomer/>
                      </Route>


                      <Route path="/customer/:id">
                        <CustomerDetail/>
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
