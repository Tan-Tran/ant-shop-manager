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
  Redirect
} from "react-router-dom";
import React,{useEffect, useState, createContext} from 'react';


const {Header, Content} = Layout

function App() {

  const[dataCustomer, setDataCustomer] = useState({})

  useEffect(() =>{
    const url = "https://shop-management-aba6f-default-rtdb.firebaseio.com/customers.json"
    
    const fetchData = async () =>{
        try{
            const response = await fetch(url)
            const data = await response.json()
            setDataCustomer(data)
        }catch(error){
            console.log("error", error)
        }
    }
    fetchData();
  },[])

  return (
    <Router>
        <div className="App">
          <Switch>
            <React.Fragment>              
              <Layout>
                <Header>
                  <ShopHeader/>
                </Header>
                <Layout>
                  <ShopSidebar/>
                  <Content>

                    <Route path="/" exact>
                      <Customer/>
                    </Route>

                    <Route path="/customer" exact>
                      <Customer/>
                    </Route>

                    <Route path="/product">
                      <Product/>
                    </Route>

                    <Route path="/order">
                      <Order/>
                    </Route>
                    
                    <Route path="/add-customer">
                      <AddCustomer/>
                    </Route>


                    <Route path="/customer/:id">
                      <CustomerDetail customers={dataCustomer}/>
                    </Route>

                  </Content>
                </Layout>
              </Layout>
            </React.Fragment>
          </Switch>
        </div>
    </Router>
  );
}

export default App;
