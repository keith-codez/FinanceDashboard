import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CurrencyContext } from "../context/CurrencyContext";
import currencyFlags from "../utils/currencyFlags";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedCurrency, convertCurrency, setSelectedCurrency, exchangeRates } = useContext(CurrencyContext);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/transactions/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
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
        responseType: "blob",
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
    return <p className="text-center text-gray-600">Loading transactions...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Transaction History
      </h2>

      {/* Currency Selector (Only One Place) */}
      <div className="mb-4 flex justify-center">
        <label className="mr-2 font-semibold">Select Currency:</label>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="p-2 border rounded flex items-center"
        >
          {Object.keys(exchangeRates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        {currencyFlags[selectedCurrency] && (
          <img src={currencyFlags[selectedCurrency]} alt={selectedCurrency} className="ml-2 w-6 h-4" />
        )}
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={downloadPDF}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300"
        >
          Download PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Amount ({selectedCurrency})</th>
              <th className="px-4 py-2 border">Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">
                  {new Intl.DateTimeFormat("en-GB").format(new Date(transaction.date))}
                </td>
                <td className="px-4 py-2 border">{transaction.description}</td>
                <td className="px-4 py-2 border flex items-center">
                  {currencyFlags[selectedCurrency] && (
                    <img src={currencyFlags[selectedCurrency]} alt={selectedCurrency} className="w-6 h-4 mr-2" />
                  )}
                  {selectedCurrency} {convertCurrency(transaction.amount)}
                </td>
                <td className={`px-4 py-2 border font-semibold ${transaction.transaction_type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
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