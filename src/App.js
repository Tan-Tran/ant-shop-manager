import React from 'react';
import ShopHeader from './components/header/Header';
import ShopSidebar from './components/sidebar/Sidebar';
import Customer from './components/pages/Customer';
import Product from './components/pages/Product';
import Order from './components/pages/Order';
import AddOrder from './pages/Order/AddOrder';
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import 'antd/dist/antd.css';

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
