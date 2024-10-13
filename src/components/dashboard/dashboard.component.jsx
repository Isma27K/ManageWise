import React, { useState, useContext } from 'react';
import { Layout, Menu } from 'antd';
import { SettingOutlined, AppstoreOutlined, SafetyOutlined, AuditOutlined, FieldTimeOutlined } from '@ant-design/icons';
import './dashboard.style.scss';
import MainDashboard from '../main-dashboard/main-dashboard.component.jsx';
import SettingDashboard from '../setting-dashboard/setting-dashboard.component.jsx';
import AdminDashboard from '../admin-dashboard/admin.component.jsx';
import Footer from '../footer/footer.component.jsx';
import { UserContext } from '../../contexts/UserContext';
// If you have Settings and Report components, make sure to import them
// import Settings from '../settings/settings.component.jsx';
// import Report from '../report/report.component.jsx';

const { Sider, Content } = Layout;

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [content, setContent] = useState(<MainDashboard />);
  const [selectedKey, setSelectedKey] = useState('1');

  const isAdmin = user?.admin;

  // Define the menu click handler
  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    switch (e.key) {
      case '1':
        setContent(<MainDashboard />);
        break;
      case '2':
        setContent(<SettingDashboard />);
        break;
      case '3':
        // setContent(<Report />);
        break;
      case '4':
        setContent(<AdminDashboard />);
        break;
      default:
        setContent(<MainDashboard />);
    }
  };

  return (
    <Layout className="dashboard-layout">
      <Sider className="sider-style" width="250px">
        <div style={{ padding: '16px' }}>
          <h2>Menu</h2>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
          >
            {/* Menu Group */}
            <Menu.ItemGroup key="g1" title="Main Menu">
              <Menu.Item key="1" icon={<AppstoreOutlined />}>Dashboard</Menu.Item>
              <Menu.Item key="5" icon={<FieldTimeOutlined />} disabled>Archive (Coming Soon)</Menu.Item>
              <Menu.Item key="3" icon={<AuditOutlined />} disabled>Report (Coming Soon)</Menu.Item>
              {isAdmin && (
                <Menu.Item key="4" icon={<SafetyOutlined />}>Admin</Menu.Item>
              )}
              <Menu.Item key="2" icon={<SettingOutlined />}>Settings</Menu.Item>
            </Menu.ItemGroup>
          </Menu>


        </div>
      </Sider>
      <Layout style={{ marginLeft: 250, padding: '24px' }}>
        <Content className="content-style">
          {content}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Dashboard;
