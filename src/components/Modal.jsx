import React from 'react';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md sm:w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default Modal;