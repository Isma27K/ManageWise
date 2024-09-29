import React, { useState, useEffect } from 'react';
import { Card, Modal, Button, List, Popconfirm, Tooltip, Avatar, Spin, Input, Select, Upload, message } from 'antd';
import { FileOutlined, LoadingOutlined, ExclamationCircleOutlined, PlusOutlined, UploadOutlined, PaperClipOutlined, CloseOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import './card.style.scss';

const { Meta } = Card;
const { Option } = Select;

// Dummy contributor data
const contributors = [
  { id: 1, name: "John Doe", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" },
  { id: 2, name: "Jane Smith", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" },
  { id: 3, name: "Bob Johnson", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=3" },
  { id: 4, name: "Alice Brown", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=4" },
  { id: 5, name: "Charlie Davis", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=5" },
  { id: 6, name: "Eva Wilson", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=6" },
];

const CustomCard = ({ image, title, description, task, contributors = [] }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [contributorsLoading, setContributorsLoading] = useState(true);
  const [loadedContributors, setLoadedContributors] = useState([]);
  const [newSubtask, setNewSubtask] = useState({ name: '', assignedUsers: [], file: null });
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    // Simulate fetching contributors data
    const fetchContributors = async () => {
      // Simulating an API call with setTimeout
      setTimeout(() => {
        setLoadedContributors(contributors);
        setContributorsLoading(false);
      }, 1000);
    };

    fetchContributors();
  }, [contributors]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    //setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDownload = (attachment) => {
    // Assuming attachment is a URL; use `window.open` for opening in a new tab
    window.open(attachment, '_blank');
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24, color: 'black' }} spin />;

  const handleSubtaskNameChange = (e) => {
    setNewSubtask({ ...newSubtask, name: e.target.value });
  };

  const handleUserAssignment = (values) => {
    setNewSubtask({ ...newSubtask, assignedUsers: values });
  };

  const handleFileUpload = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleRemoveFile = (file) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(newFileList);
  };

  const handleViewAttachment = (file) => {
    if (file.url) {
      window.open(file.url, '_blank');
    } else {
      message.error('File URL is not available');
    }
  };

  const uploadProps = {
    multiple: true,
    fileList,
    onChange: handleFileUpload,
    beforeUpload: (file) => {
      if (fileList.length >= 3) {
        message.error('You can only upload up to 3 files');
        return Upload.LIST_IGNORE;
      }
      return false; // Prevent auto upload
    },
    onRemove: handleRemoveFile,
  };

  const handleSave = () => {
    // Logic to save the new subtask and other changes
    console.log('Saving subtask:', newSubtask);
    // Reset form fields
    setNewSubtask({ name: '', assignedUsers: [], file: null });
    // Close modal
    //setIsModalVisible(false);
  };

  return (
    <>
      <Card
        hoverable
        cover={<img alt={title} src={image} />}
        style={{ width: 225, margin: '16px auto' }}
        onClick={showModal}
      >
        <Meta title={title} description={description} />
      </Card>


      {/*=========================== Modal Was Here======================================== */}

      <Modal
        title={title}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        className="custom-modal"
        width="80vw"
      >
        <div className="modal-content">
          <div className="modal-left">
            <h3>Tasks</h3>
            {Object.keys(task).length !== 0 ? (
              <List
                className="task-list"
                dataSource={Object.values(task)}
                renderItem={(item) => (
                  <List.Item>
                    <div className="list-item-content">{item.name}</div>
                    <div className="list-item-actions">
                      {item.attachments && item.attachments.map((attachment, index) => (
                        <Tooltip key={index} title={attachment.name}>
                          <PaperClipOutlined 
                            onClick={() => handleViewAttachment(attachment)} 
                            className="attachment-icon"
                          />
                        </Tooltip>
                      ))}
                      <Popconfirm
                        title="Do you want to close this task?"
                        onConfirm={() => {/* Add logic to close the task */}}
                        okText="Yes"
                        cancelText="No"
                        icon={<ExclamationCircleOutlined style={{ color: 'black' }} />}>
                        <Button className="close-button">Close</Button>
                      </Popconfirm>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <p>No tasks available</p>
            )}
          </div>
          <div className="modal-right">
            <h3>Create Subtask</h3>
            <div className="subtask-form">
              <Input
                placeholder="Subtask name"
                value={newSubtask.name}
                onChange={handleSubtaskNameChange}
              />
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Assign users"
                onChange={handleUserAssignment}
                value={newSubtask.assignedUsers}
              >
                {contributors.map(contributor => (
                  <Option key={contributor.id} value={contributor.id}>{contributor.name}</Option>
                ))}
              </Select>
              <Upload {...uploadProps} className="file-upload">
                <Button icon={<UploadOutlined />}>Choose File(s)</Button>
              </Upload>
              {fileList.length > 0 && (
                <List
                  size="small"
                  className="file-list"
                  dataSource={fileList}
                  renderItem={(file) => (
                    <List.Item className="file-list-item">
                      <div className="file-info">
                        <PaperClipOutlined className="attachment-icon" />
                        <span className="file-name" title={file.name}>
                          {file.name.length > 40 ? file.name.substring(0, 40) + '...' : file.name}
                        </span>
                      </div>
                      <Button 
                        type="text" 
                        onClick={() => handleRemoveFile(file)} 
                        icon={<CloseOutlined />}
                        className="remove-file-button"
                      />
                    </List.Item>
                  )}
                />
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div className="contributors-section">
            <p className="contributors-label">Contributors</p>
            {contributorsLoading ? (
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            ) : loadedContributors.length > 0 ? (
              <Avatar.Group
                maxCount={4}
                maxStyle={{
                  color: 'white',
                  backgroundColor: 'black',
                }}
              >
                {loadedContributors.map((contributor) => (
                  <Tooltip key={contributor.id} title={contributor.name} placement="top">
                    <Avatar src={contributor.avatar} alt={contributor.name}>
                      {contributor.name.charAt(0)}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            ) : (
              <p className="no-contributors">No contributors yet</p>
            )}
          </div>
          <Button className="save-button" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Modal>
    </>
  );
};

CustomCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  contributors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    })
  ),
};

export default CustomCard;
