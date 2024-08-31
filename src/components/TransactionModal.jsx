import React from 'react';

function TransactionModal({ transaction, onClose, formatCurrency }) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{transaction.store}</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Date: {new Date(transaction.date).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              Amount: {formatCurrency(transaction.amount, transaction.currency)}
            </p>
            <p className="text-sm text-gray-500">
              Description: {transaction.description}
            </p>
            {transaction.image && (
              <img src={transaction.image} alt="Receipt" className="mt-2 mx-auto max-w-full h-auto" />
            )}
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;