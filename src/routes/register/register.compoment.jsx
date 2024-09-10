
// ========================================== Import part ================================================== 

import React, { useState } from "react";
import {LockOutlined, UserOutlined, MailOutlined} from '@ant-design/icons';
import {Button, Checkbox,Form,Input} from 'antd';
import "./register.style.scss";

const Register = () => {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    return (
        <Form className="register" name="register" onFinish={onFinish}>
            <div className="register-wrapper">
            <h2>Register</h2>
            <Form.Item name="username" rules={[{required: true, message: 'Field is required!',},]}>
                <Input prefix={<UserOutlined/>} placeholder="Username"/>
            </Form.Item>

            <Form.Item name="email" rules={[{required: true, type: 'email', message: 'Field is required!',},]}>
                <Input prefix={<MailOutlined/>} placeholder="Email"/>
            </Form.Item>

            <Form.Item name="password" rules={[{required: true, message: 'Field is required!',},]}>
                <Input prefix={<LockOutlined/>} type="password" placeholder="Password"/>
            </Form.Item>

            <Form.Item name="confirm" dependencies={['password']} rules={[{required: true, message: 'Field is required!',},
                ({getFieldValue}) => ({
                    validator(_, value){
                        if(!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('Password do not match.')); 
                },
            }),
            
            ]}>
                <Input prefix={<LockOutlined/>} type="password" placeholder="Confirm Password"/>
            </Form.Item>

            <Form.Item>
                <Button block type="primary" htmlType="submit">
                    Register
                </Button>
            </Form.Item>
            </div>

        </Form>
    );
}

export default Register;




