import React, { useState } from "react";

const SecretKeyModal = ({ isOpen, onClose, onConfirm }) => {
  const [key, setKey] = useState("");

  const handleSubmit = () => {
    onConfirm(key);
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-center">🔒</h2>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecretKeyModal;
