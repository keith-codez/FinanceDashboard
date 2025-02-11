import React, { useState, useEffect } from "react";
import { getWallet } from "../api.js";

const Wallet = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getWallet();
      if (data) setBalance(data.balance);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
        Wallet Balance
      </h2>

      <div className="flex justify-center items-center">
        {loading ? (
          <p className="text-xl text-gray-500">Loading...</p>
        ) : (
          <p className={`text-4xl font-semibold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
            £{balance.toFixed(2)}
          </p>
        )}
      </div>

      <div className="mt-6 border-t-2 border-gray-200 pt-4 text-center">
        <p className="text-sm text-gray-500">
          Keep track of your expenses and transactions
        </p>
      </div>
    </div>
  );
};

export default Wallet;