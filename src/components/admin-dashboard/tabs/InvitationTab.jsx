import React, { useState } from 'react';
import { Form, Input, Button, message, Tooltip, notification } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const InvitationTab = () => {
  const [form] = Form.useForm();
  const [invitationLink, setInvitationLink] = useState('');
  const token = localStorage.getItem('jwtToken');

  const openNotification = (type, message, description) => {
    notification[type]({
        message,
        description,
        placement: 'topRight',
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationLink).then(() => {
      message.success('Link copied to clipboard!');
    }).catch(() => {
      message.error('Failed to copy link.');
    });
  };

  const truncateLink = (link) => {
    return link.length > 60 ? `${link.substring(0, 27)}...` : link;
  };

  const handleGenerateInvitation = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/admin/generate', {
      method: 'POST',
      headers: 
      {'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    //console.log(token);

    if (!response.ok) {
      openNotification('error', 'Error', 'Failed to generate invitation link');
      return;
    }

    const data = await response.json();
    const generatedLink = 'http://localhost:3000/register?invitation=' + data.id;
    setInvitationLink(generatedLink);
    form.setFieldsValue({ invLink: generatedLink });
  };

  return (
    <Form layout="vertical" className="admin-form" form={form}>
      <Form.Item label="INV LINK GENERATOR">
        <div className="inv-link-container">
          <Input 
            readOnly 
            value={truncateLink(invitationLink || 'Generated link will appear here')}
            className="inv-link-input"
            suffix={
              <Tooltip title="Copy link">
                <Button 
                  icon={<CopyOutlined />} 
                  onClick={handleCopy} 
                  className="copy-button"
                />
              </Tooltip>
            }
          />
        </div>
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={handleGenerateInvitation} className="generate-button">GENERATE</Button>
      </Form.Item>
    </Form>
  );
};

export default InvitationTab;