import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addConnection, removeConnection } from '../slices/userSlice';

const ConnectionManager = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const connections = useSelector((state) => state.user.connections);
  const [newConnection, setNewConnection] = useState('');

  const handleAddConnection = () => {
    if (newConnection.trim()) {
      dispatch(addConnection(newConnection.trim()));
      setNewConnection('');
    }
  };

  const handleRemoveConnection = (connectionId) => {
    dispatch(removeConnection(connectionId));
  };

  if (!user) return null;

  return (
    <div className="connection-manager">
      <h2>
        {user.type === 'seller' ? 'Connected Buyers' : 'Connected Sellers'}
      </h2>
      
      <div className="add-connection">
        <input
          type="text"
          value={newConnection}
          onChange={(e) => setNewConnection(e.target.value)}
          placeholder={`Enter ${user.type === 'seller' ? 'buyer' : 'seller'} ID`}
        />
        <button onClick={handleAddConnection}>Add Connection</button>
      </div>

      <div className="connections-list">
        {connections.length === 0 ? (
          <p>No connections yet</p>
        ) : (
          connections.map((connection) => (
            <div key={connection} className="connection-item">
              <span>{connection}</span>
              <button onClick={() => handleRemoveConnection(connection)}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .connection-manager {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin: 20px 0;
        }

        .add-connection {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .add-connection input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .add-connection button {
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .connections-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .connection-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 4px;
        }

        .connection-item button {
          padding: 4px 8px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ConnectionManager; 