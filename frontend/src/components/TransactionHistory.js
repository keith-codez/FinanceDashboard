import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/transactions/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  const downloadPDF = async () => {
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/transactions/pdf/", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "transaction_history.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading PDF", error);
    }
  };



  if (loading) {
    return <p>Loading transactions...</p>;
  }

  const hasTransactions = transactions.length > 0;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
      {hasTransactions && (
        <button
          onClick={downloadPDF}
          className="mb-4 p-2 bg-blue-500 text-white rounded"
        >
          Download PDF
        </button>
      )}
      {!hasTransactions && <p>No transactions available</p>}

      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Type</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{new Date(transaction.date).toISOString().split("T")[0]}</td>
              <td className="px-4 py-2 border">{transaction.description}</td>
              <td className="px-4 py-2 border">£{transaction.amount}</td>
              <td className="px-4 py-2 border">{transaction.transaction_type === "credit" ? "Credit" : "Debit"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;