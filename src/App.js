import './App.css';
import AppHeader from './components/common/Header'
import AppSideBar from './components/common/Sidebar'
import Customer from './components/detail/Customer'
import Product from './components/detail/Product'
import Order from './components/detail/Order'
import AddCustomer from './components/common/AddCustomer'

import 'antd/dist/antd.css'
import {Layout} from 'antd'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";


const {Header, Content} = Layout

function App() {
  return (
    <Router>
      <Switch>
        <div className="App">
          <Layout>
            <Header>
              <AppHeader/>
            </Header>
            <Layout>
              <AppSideBar/>
              <Content>
                <Route path="/" exact>
                  <Customer/>
                </Route>
                <Route path="/customer">
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
              </Content>
            </Layout>
          </Layout>
        </div>
      </Switch>
    </Router>
  );
}

export default App;
