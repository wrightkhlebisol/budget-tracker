import React from 'react';
import Modal from './Modal';

function TransactionModal({ transaction, onClose, formatCurrency }) {
  if (!transaction) return null;

  return (
    <Modal isOpen={!!transaction} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">{transaction.store}</h2>
        <p className="mb-2"><strong>Date:</strong> {new Date(transaction.date).toLocaleString()}</p>
        <p className="mb-2"><strong>Total Amount:</strong> {formatCurrency(transaction.amount, transaction.currency)}</p>
        <p className="mb-4"><strong>Description:</strong> {transaction.description}</p>
        
        {transaction.subEntries && transaction.subEntries.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Sub-entries</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Item</th>
                  <th className="border p-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {transaction.subEntries.map((entry, index) => (
                  <tr key={index} className="border-b">
                    <td className="border p-2">{entry.name}</td>
                    <td className="border p-2 text-right">{formatCurrency(entry.price, transaction.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default TransactionModal;