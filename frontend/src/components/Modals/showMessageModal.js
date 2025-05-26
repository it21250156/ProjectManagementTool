import React, { useState } from "react";

const ShowMessageModal = ({ user, open, onClose, onSend }) => {
  const [message, setMessage] = useState("");

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">Message to {user.name}</h2>
        <textarea
          className="w-full border rounded p-2 mb-4"
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() => {
              setMessage("");
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded"
            onClick={() => {
              onSend(message);
              setMessage("");
            }}
            disabled={!message.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowMessageModal;