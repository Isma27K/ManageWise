// ========================================== Import part ================================================== 

import React,{useEffect, useState} from 'react';
import {Form, Input, Checkbox, Button} from 'antd';
import { LockOutlined, MailOutlined} from '@ant-design/icons';
import "./login.style.scss";

const Login = () => {

    const onFinish = (values) => {
        console.log('Received values of form:', values);
    };

    return (
        <Form className="login" name="login" onFinish={onFinish}>
            <div className="login-wrapper">
            <h2>Login</h2>
            <Form.Item name="email" rules={[{required: true, type: 'email', message: 'Field is required!',},]}>
                <Input prefix={<MailOutlined/>} placeholder="Email"/>
            </Form.Item>

            <Form.Item name="password" rules={[{required: true, message: 'Field is required!',},]}>
                <Input prefix={<LockOutlined/>} type="password" placeholder="Password"/>
            </Form.Item>

            <Form.Item className="forget">
                <a href="">Forgot password?</a>
            </Form.Item>

            <Form.Item>
                <Button block type="primary" htmlType="submit">
                    Log In
                </Button>
            </Form.Item>
            </div>

        </Form>
    );
};
export default Login;

