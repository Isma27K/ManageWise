import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Card, Select, Tooltip, message, Popconfirm } from 'antd';
import { SendOutlined, CloseOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import './chatBox.style.scss';

const ChatBox = ({ onClose, visible }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('jwtToken');
  const [textAreaHeight, setTextAreaHeight] = useState(32); // Default height

  // Modified useEffect to ensure we start with a new conversation
  useEffect(() => {
    const loadConversations = async () => {
      await fetchConversations();
      // Explicitly set to null after fetching to ensure we start with a new conversation
      setCurrentConversationId(null);
    };
    loadConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('https://routes.managewise.top/api/v1/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.conversations) {
        setConversations(data.conversations);
        // Remove this line to prevent auto-selecting the first conversation
        // if (data.conversations.length > 0 && !currentConversationId) {
        //   setCurrentConversationId(data.conversations[0]._id);
        // }
      }
    } catch (error) {
      message.error('Failed to load conversations');
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      // Disable resize observer temporarily
      setIsLoading(true); // This will prevent textarea resize events

      const response = await fetch('https://routes.managewise.top/api/v1/conversation', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ conversationId })
      });

      if (response.ok) {
        // Update state in the next tick to avoid resize observer conflicts
        setTimeout(() => {
          setConversations(prev => prev.filter(conv => conv._id !== conversationId));
          if (currentConversationId === conversationId) {
            const remainingConversations = conversations.filter(conv => conv._id !== conversationId);
            setCurrentConversationId(remainingConversations[0]?._id || null);
          }
          message.success('Conversation deleted successfully');
        }, 0);
      } else {
        throw new Error('Failed to delete conversation');
      }
    } catch (error) {
      message.error(error.message || 'Failed to delete conversation');
    } finally {
      // Re-enable resize observer
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
  };

  const getCurrentConversation = () => {
    return conversations.find(conv => conv._id === currentConversationId);
  };

  const sendMessageToBackend = async (userMessage) => {
    try {
      // Immediately update the conversations UI with user's message
      if (currentConversationId) {
        setConversations(prev => prev.map(conv => {
          if (conv._id === currentConversationId) {
            return {
              ...conv,
              history: [...(conv.history || []), 
                { role: 'user', parts: [{ text: userMessage }] }
              ]
            };
          }
          return conv;
        }));
      } else {
        // For new conversation, create a temporary conversation
        const tempConv = {
          _id: 'temp',
          history: [{ role: 'user', parts: [{ text: userMessage }] }],
          createdAt: new Date()
        };
        setConversations(prev => [...prev, tempConv]);
        setCurrentConversationId('temp');
      }

      // Send the message to backend
      const response = await fetch('https://routes.managewise.top/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId: currentConversationId,
          newConversation: !currentConversationId
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const aiResponse = data.message.candidates[0].content.parts[0].text;

      if (!currentConversationId || currentConversationId === 'temp') {
        setCurrentConversationId(data.conversationId);
        fetchConversations(); // Refresh conversations to get the new one
      } else {
        // Update the current conversation in the list with AI response
        setConversations(prev => prev.map(conv => {
          if (conv._id === currentConversationId) {
            return {
              ...conv,
              history: [...(conv.history || []), 
                { role: 'model', parts: [{ text: aiResponse }] }
              ],
              lastUpdated: new Date()
            };
          }
          return conv;
        }));
      }

      return aiResponse;
    } catch (error) {
      message.error(error.message || 'Failed to send message');
      return 'Sorry, there was an error processing your request.';
    }
  };

  const handleSend = async () => {
    if (inputMessage.trim()) {
      const messageToSend = inputMessage.trim();
      setInputMessage('');
      setIsLoading(true);
      await sendMessageToBackend(messageToSend);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Add debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Debounced resize handler
  const handleTextAreaResize = useCallback(
    debounce(({ target: textarea }) => {
      const minHeight = 32;
      const maxHeight = 150;
      
      // Reset height to auto to get the proper scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new height
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      setTextAreaHeight(newHeight);
    }, 100), // 100ms debounce delay
    []
  );

  // Add this ref for the messages container
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add useEffect to scroll on new messages or loading state change
  useEffect(() => {
    scrollToBottom();
  }, [conversations, isLoading]);

  if (!visible) return null;

  const currentConversation = getCurrentConversation();

  const renderMessage = (msg) => {
    if (msg.role === 'user') {
      return <div className="message-text">{msg.parts[0].text}</div>;
    }
    
    return (
      <div className="message-text">
        <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="chat-box">
      <Card 
        className="chat-card"
        title={
          <div className="chat-header">
            <Select
              value={currentConversationId}
              onChange={(value) => {
                console.log('Selected conversation:', value);
                setCurrentConversationId(value);
              }}
              style={{ width: '200px' }}
              placeholder="Select conversation"
              dropdownStyle={{ zIndex: 10001 }}
              onClick={(e) => e.stopPropagation()}
              options={conversations.map(conv => ({
                value: conv._id,
                label: new Date(conv.createdAt).toLocaleString()
              }))}
            />
            <Tooltip title="New Conversation">
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={startNewConversation}
              />
            </Tooltip>
            {currentConversationId && (
              <Popconfirm
                title="Delete this conversation?"
                onConfirm={() => deleteConversation(currentConversationId)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete Conversation">
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    danger
                  />
                </Tooltip>
              </Popconfirm>
            )}
          </div>
        }
        extra={
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={onClose}
          />
        }
      >
        <div className="chat-messages">
          {currentConversation?.history?.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.role === 'user' ? 'user' : 'ai'}`}
            >
              {renderMessage(msg)}
            </div>
          ))}
          {isLoading && (
            <div className="message ai loading">
              Thinking...
            </div>
          )}
          {/* Add this div as the last element */}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input">
          <Input.TextArea
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
              handleTextAreaResize(e);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{ height: textAreaHeight }}
            disabled={isLoading}
            autoSize={{ minRows: 1, maxRows: 6 }} // Add this line
          />
          <Button 
            type="primary" 
            icon={<SendOutlined />} 
            onClick={handleSend}
            loading={isLoading}
          />
        </div>
      </Card>
    </div>
  );
};

export default ChatBox;
