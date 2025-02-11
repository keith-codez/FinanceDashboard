import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CurrencyContext } from "../context/CurrencyContext";

import currencyFlags from "../utils/currencyFlags";

const WalletComponent = () => {
  const [balance, setBalance] = useState(0);
  const { selectedCurrency, convertCurrency } = useContext(CurrencyContext);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/wallet/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        setBalance(response.data.balance);
      } catch (error) {
        console.error("Error fetching wallet balance", error);
      }
    }

    fetchBalance();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Wallet</h2>

      <div className="p-4 border rounded bg-gray-100 text-center">
        <p className="text-lg font-bold">Current Balance:</p>
        <p className="text-2xl font-semibold flex justify-center items-center">
          {currencyFlags[selectedCurrency] && (
            <img src={currencyFlags[selectedCurrency]} alt={selectedCurrency} className="w-6 h-4 mr-2" />
          )}
          {selectedCurrency} {convertCurrency(balance)}
        </p>
      </div>
    </div>
  );
};

export default WalletComponent;