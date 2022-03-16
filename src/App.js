import './App.css';
import AppHeader from './components/common/Header'
import AppSideBar from './components/common/Sidebar'
import Customer from './components/detail/Customer'
import Product from './components/detail/Product'
import Order from './components/detail/Order'
// import UpdateCustomer from './components/pages/UpdateCustomer'

import 'antd/dist/antd.css'
import {Layout} from 'antd'

const {Header, Content} = Layout

function App() {
  return (
    <div className="App">
      <Layout>
        <Header>
          <AppHeader/>
        </Header>
        <Layout>
          <AppSideBar/>
          <Content>
            <Customer/>
            {/* <Product/> */}
            {/* <Order/> */}
            {/* <UpdateCustomer/> */}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
