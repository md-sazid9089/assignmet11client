import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/transactions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="dark:bg-black">
      <Helmet>
        <title>Transaction History - Uraan</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-6 dark:text-black">
        Transaction History
      </h1>

      <div className="bg-white dark:bg-black rounded-xl shadow-lg overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="dark:text-gray-900">
              <th className="dark:text-gray-200">Transaction ID</th>
              <th className="dark:text-gray-200">Ticket Title</th>
              <th className="dark:text-gray-200">Amount</th>
              <th className="dark:text-gray-200">Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction._id}
                className="dark:text-gray-300 dark:border-gray-700"
              >
                <td className="dark:text-gray-300">
                  {transaction.transactionId}
                </td>
                <td className="dark:text-gray-300">
                  {transaction.ticketTitle}
                </td>
                <td className="font-semibold dark:text-gray-200">
                  ৳{transaction.amount}
                </td>
                <td className="dark:text-gray-300">
                  {new Date(transaction.paymentDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
