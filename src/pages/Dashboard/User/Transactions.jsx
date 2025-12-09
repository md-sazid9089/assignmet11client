import { useState, useEffect } from 'react';
import api from '../../../config/api';
import toast from 'react-hot-toast';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/payments/transactions');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-400"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold gradient-text mb-6">Transaction History</h2>

      {transactions.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No transactions yet.
          </p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-dark-lighter">
                <th className="text-left py-3 px-4 font-semibold">Transaction ID</th>
                <th className="text-left py-3 px-4 font-semibold">Ticket Title</th>
                <th className="text-left py-3 px-4 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction._id}
                  className="border-b border-gray-200 dark:border-dark-lighter hover:bg-gray-50 dark:hover:bg-dark-lighter"
                >
                  <td className="py-3 px-4 font-mono text-sm">
                    {transaction._id.slice(-8)}
                  </td>
                  <td className="py-3 px-4">{transaction.ticketTitle}</td>
                  <td className="py-3 px-4 text-primary-500 font-bold">
                    ${transaction.amount}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="badge bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
