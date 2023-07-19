import React, { useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { EditorState, convertToRaw, convertFromRaw, ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { Linkify } from 'react-linkify';
import { MentionsInput, Mention } from 'react-mentions';
// import { Emoji } from 'react-emoji-render';
import Dropzone from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../provider/UserProvider';
import '../App.css';

export default function Chatbox() {
  const { username, socket, setSocket, messages, setMessages, editorState, setEditorState } = useContext(UserContext);

  window.onbeforeunload = () => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  };

  const ENDPOINT = 'http://localhost:5000';

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const storedMessages = JSON.parse(sessionStorage.getItem('chatMessages'));
    if (storedMessages) {
      setMessages(storedMessages);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', (messageData) => {
        setMessages((currentMsg) => [...currentMsg, messageData]);
      });
    }
  }, [socket]);

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    // console.log(newEditorState)
    
  };

  const sendMessage = () => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const content = JSON.stringify(rawContentState);

    if (content !== '') {
      socket.emit('sendMessage', { author: username, message: content });
      setEditorState(EditorState.createEmpty());
    }
  };

  const renderMessageContent = (content) => {
    const contentState = ContentState.createFromText('');
    const rawContentState = JSON.parse(content);
    const messageContentState = convertFromRaw(rawContentState);
    const messageEditorState = EditorState.createWithContent(messageContentState);

    return (
      <Editor
        editorState={messageEditorState}
        readOnly={true}
        toolbarHidden={true}
      />
    );
  };

  const renderMessage = (msg, index) => {
    return (
      <div key={index} className="message">
        <div className="username">{msg.author}</div>
        <div className="chatmessage">
          <span>{renderMessageContent(msg.message)}</span>  </div>
      </div>
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };



  return (
    <>
      <div className="chat_app">
        <div className="chat">
         {messages.map((message, index) => renderMessage(message, index))}
        </div>
        <div className="chatInput">
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
            mention={{
              separator: " ",
              trigger: "@",
              suggestions: [
                { text: "APPLE", value: "apple" },
                { text: "BANANA", value: "banana", url: "banana" },
                { text: "CHERRY", value: "cherry", url: "cherry" },
                { text: "DURIAN", value: "durian", url: "durian" },
                { text: "EGGFRUIT", value: "eggfruit", url: "eggfruit" },
                { text: "FIG", value: "fig", url: "fig" },
                { text: "GRAPEFRUIT", value: "grapefruit", url: "grapefruit" },
                { text: "HONEYDEW", value: "honeydew", url: "honeydew" }
              ]
            }}
            toolbar={{
              options: [
                'inline',
                'blockType',
                'list',
                'link',
                'emoji',
                'blockType',
                'textAlign',
                'history',
              ],
              inline: { options: ['bold', 'italic', 'strikethrough'] },
              list: { options: ['unordered', 'ordered'] },
              blockType: { options: ['Blockquote', 'Code'] },
              textAlign: { options: ['left', 'center', 'right'] },
              link: { options: ['link'] },
              emoji: true,
              
            }}
          placeholder="Type your message..."
          onKeyDown={handleKeyDown}
          />
          <button id="send-btn" onClick={sendMessage} className="material-symbol-outlined">
            Send
          </button>
        </div>
          <ToastContainer />
      </div>
    </>
  );
}


