import React, { useState } from 'react';
import { Form, Select, Input, Button, message } from 'antd';

const { Option } = Select;

const EditPoolInfo = ({ pools }) => {
    const [form] = Form.useForm();
    const [selectedPool, setSelectedPool] = useState(null);
    const token = localStorage.getItem('jwtToken');
    const [loading, setLoading] = useState(false);

    const handlePoolSelect = (poolId) => {
        const pool = pools.find(p => p._id === poolId);
        setSelectedPool(pool);
        form.setFieldsValue({
            poolId: pool._id,
            name: pool.name,
            description: pool.description,
            // Add other fields as needed
        });
    };

    const handleUpdatePool = async (values) => {
        setLoading(true);
        if (!selectedPool) {
            message.error('Please select a pool to update');
            setLoading(false);
            return;
        }

        try {
            //await onUpdatePool(selectedPool._id, values);

            const response = await fetch('https://isapi.ratacode.top/update/pool', {
                method: 'POST',
                headers: 
                {'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            }); 
            
            console.log(values);
            message.success('Pool information updated successfully');
            form.resetFields();
            setSelectedPool(null);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            message.error('Failed to update pool information');
        }
    };

    return (
        <>
            <h3>Edit Pool Info</h3>
            <Form layout="vertical" form={form} onFinish={handleUpdatePool} className="admin-form">
                <Form.Item 
                    name="poolId" 
                    label="Select Pool"
                    rules={[{ required: true, message: 'Please select a pool to edit' }]}
                >
                    <Select
                        placeholder="Select a pool to edit"
                        onChange={handlePoolSelect}
                        style={{ width: '100%' }}
                    >
                        {pools.map(pool => (
                            <Option key={pool._id} value={pool._id}>{pool.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="name"
                    label="Pool Name"
                    rules={[{ required: true, message: 'Please enter the pool name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Pool Description"
                    rules={[{ required: false, message: 'Please enter the pool description' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                {/* Add other form items for additional pool information */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className='update-button' loading={loading}>
                        Update Pool Info
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default EditPoolInfo;
