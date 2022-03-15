import './App.css';
import AppHeader from './components/common/header'
import AppSideBar from './components/common/sidebar'

import 'antd/dist/antd.css'
import {Layout} from 'antd'

const {Header} = Layout

function App() {
  return (
    <div className="App">
      <Layout>
        <Header>
          <AppHeader/>
        </Header>
        <Layout>
          <AppSideBar/>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
