import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "187e3d80a3814568934f9b75"; // Replace with your actual API key

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("GBP");
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/GBP`);
        setExchangeRates(response.data.conversion_rates);
      } catch (error) {
        console.error("Error fetching exchange rates", error);
      }
    }

    fetchExchangeRates();
  }, []);

  const convertCurrency = (amount) => {
    const rate = exchangeRates[selectedCurrency] || 1;
    return (Number(amount) * rate).toFixed(2);
  };

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency, exchangeRates, convertCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};