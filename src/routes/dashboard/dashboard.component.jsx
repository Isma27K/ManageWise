import React, { useContext, useState } from "react";
import {DashboardFilled, UserOutlined, TeamOutlined} from '@ant-design/icons';
import {Breadcrumb, Layout, Menu, theme, Input, Avatar} from 'antd';
import "./dashboard.style.scss";

const {Header, Content, Footer, Sider} = Layout;
function getItem(label, key, icon, children) {
    return {
        key, icon, children, label
    };
}

const items = [
    getItem('Option 1', '1', <DashboardFilled/>),
    getItem('Option 2', '2', <UserOutlined/>),
    getItem('User', 'sub1', <TeamOutlined/>, [
        getItem('Faiz', '3'),
        getItem('Ismail','4'),
        getItem('Fadhli','5')
    ]),
];

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    return(
        <Layout style={{minHeight: '100vh',}}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>

            </Sider>
        </Layout>
        
    )
    }

export default Dashboard;