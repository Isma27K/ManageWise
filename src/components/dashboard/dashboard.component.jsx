import React, { useState, useContext, useEffect } from 'react';
import { Layout, Menu, FloatButton } from 'antd';
import { SettingOutlined, AppstoreOutlined, SafetyOutlined, AuditOutlined, FieldTimeOutlined } from '@ant-design/icons';
import './dashboard.style.scss';
import MainDashboard from '../main-dashboard/main-dashboard.component.jsx';
import SettingDashboard from '../setting-dashboard/setting-dashboard.component.jsx';
import AdminDashboard from '../admin-dashboard/admin.component.jsx';
import Footer from '../footer/footer.component.jsx';
import Archive from '../../routes/archive/archive.jsx';
import { UserContext } from '../../contexts/UserContext';
import Report from '../../routes/report/report.jsx';

// If you have Settings and Report components, make sure to import them
// import Settings from '../settings/settings.component.jsx';
// import Report from '../report/report.component.jsx';

const { Sider, Content } = Layout;

const Dashboard = () => {
  const { user, setGlobalSearchTerm } = useContext(UserContext);
  const [content, setContent] = useState(<MainDashboard />);
  const [selectedKey, setSelectedKey] = useState('1');
  const [showBackToTop, setShowBackToTop] = useState(false);

  const isAdmin = user?.admin;

  // Handle scroll event to show/hide BackToTop button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset >= 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        setContent(<Report />);
        break;
      case '4':
        setContent(<AdminDashboard />);
        break;
      case '5':
        setContent(<Archive />);
        break;
      default:
        setContent(<MainDashboard />);
    }
    // Clear the global search term when switching sections
    setGlobalSearchTerm('');
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
              <Menu.Item key="5" icon={<FieldTimeOutlined />}>Archive</Menu.Item>
              <Menu.Item key="3" icon={<AuditOutlined />}>Report</Menu.Item>
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
      {showBackToTop && (
        <FloatButton.Group
          shape="circle"
          style={{
            insetInlineEnd: 24,
            right: 40,
          }}
        >
          <FloatButton.BackTop visibilityHeight={50} tooltip="Back to top" />
        </FloatButton.Group>
      )}
    </Layout>
  );
};

export default Dashboard;
