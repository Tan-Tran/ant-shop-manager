import './App.css';
import ShopHeader from './components/common/Header'
import ShopSidebar from './components/common/Sidebar'
import Customer from './components/detail/Customer'
import Product from './components/detail/Product'
import Order from './components/detail/Order'

import AddCustomer from './components/pages/AddCustomer'
import EditCustomer from './components/pages/EditCustomer'
import AddProduct from './components/pages/AddProduct'
import EditProduct from './components/pages/EditProduct'
import AddOrder from './components/pages/AddOrder'
import AddOrderTable from './components/pages/AddOrderTable'
import Example from './components/edittable/Example'

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
                        <EditCustomer/>
                      </Route>

                      <Route path="/add-product">
                        <AddProduct/>
                      </Route>

                      <Route path="/product/:id">
                        <EditProduct/>
                      </Route>

                      <Route path="/order/new">
                        <AddOrderTable/>
                      </Route>

                      <Route path="/order/:id">
                        <AddOrderTable/>
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
