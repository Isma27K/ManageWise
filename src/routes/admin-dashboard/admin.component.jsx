import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined, UserOutlined, LogoutOutlined,} from '@ant-design/icons';
import { Button, Layout, Menu, Avatar, Divider, theme } from 'antd';
import DashboardContent from "../dashboard/DashboardContent";
import AdminProfile from "./AdminProfile";

const avatarUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUAENAWPWoGzohhOCuj6Q6WwOm6hbVffCZyw&s";
const { Header, Sider, Content } = Layout;
const name = "FAIZ KAMIRIN";

const AdminDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('1');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: '1',
            icon: <DashboardOutlined style={{ fontSize: '30px' }} />, 
            label: (
                <span style={{ fontSize: '20px', paddingLeft: collapsed ? '0' : '12px' }}> 
                    Dashboard
                </span>
            ),
            style: {
                height: '60px',  
                lineHeight: '60px',  
            },
        },
        {
            key: '2',
            icon: <UserOutlined style={{ fontSize: '30px' }} />, 
            label: (
                <span style={{ fontSize: '20px', paddingLeft: collapsed ? '0' : '12px' }}> 
                    Profile(Admin)
                </span>
            ),
            style: {
                height: '60px',  
                lineHeight: '60px',  
            },
        },
    ];

    const renderContent = () => {
        switch (selectedKey) {
            case '1':
                return <DashboardContent />;
            case '2':
                return <AdminProfile />;
            default:
                return <DashboardContent />;
        }
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} width={collapsed ? 100 : 300} style={{ transition: 'width 0.2s' }}>
                <div style={{ padding: '16px', textAlign: 'center', marginBottom: '18px' }}>
                    {!collapsed && (
                        <div>
                            <Avatar size={130} src={avatarUrl} style={{ marginBottom: '8px' }} />
                            <div style={{ color: 'white' }}>{name}</div>
                            <Divider style={{ backgroundColor: '#C0C0C0', margin: '10px 0' }} />
                        </div>
                    )}
                    {collapsed && (
                        <Avatar size={40} src={avatarUrl} style={{ margin: '16px auto' }} />
                    )}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[selectedKey]}
                    onClick={(e) => setSelectedKey(e.key)}
                    items={menuItems.map(item => ({
                        ...item,
                        style: {
                            fontSize: '18px',  
                            height: '60px',     
                            lineHeight: '60px', 
                            padding: collapsed ? '0 12px' : '0 24px', 
                        }
                    }))}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: '#C0C0C0', display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '1px' }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: '20px' }} /> : <MenuFoldOutlined style={{ fontSize: '20px' }} />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ fontSize: '16px', width: 64, height: 64 }}
                        />
                        <h1 style={{ marginLeft: '16px', fontSize: '24px', color: 'black' }}>ManageWise</h1>
                    </div>
                    <Button type="text" icon={<LogoutOutlined style={{ fontSize: '20px' }} />} style={{ fontSize: '16px', color: 'black', marginLeft: 'auto' }} onClick={() => {
                        // logic for logout
                    }}>
                        Logout
                    </Button>
                </Header>
                <Content>
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminDashboard;
