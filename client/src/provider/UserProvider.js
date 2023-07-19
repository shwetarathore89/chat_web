import React, { createContext, useState } from 'react';
import { EditorState } from 'draft-js';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [registeredUser, setRegisteredUser] = useState([])

  return (
    <UserContext.Provider value={{ username, setUsername, socket, setSocket, message, setMessage, messages, setMessages, editorState, setEditorState }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;