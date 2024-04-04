import React, { useState, useEffect } from "react";
import Freecurrencyapi from "@everapi/freecurrencyapi-js";

const API_KEY = "fca_live_64VHl28BVr4aXrOvgMeBDuEvHWGCzaGNb8cYpnLy";

const CurrencyExchange = () => {
  const freecurrencyapi = new Freecurrencyapi(API_KEY);
  const getYesterday = (dateOnly = false) => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return dateOnly ? new Date(d).toISOString().split('T')[0] : d;
  };
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [selectedDate, setSelectedDate] = useState(getYesterday(true));
  const [currencies, setCurrencies] = useState([
    "GBP",
    "EUR",
    "JPY",
    "CHF",
    "CAD",
    "AUD",
    "INR",
  ]);
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    fetchExchangeRates();
  });
  const fetchExchangeRates = async () => {
    try {
      freecurrencyapi
        .historical({
          date: selectedDate,
          base_currency: baseCurrency,
          currencies: currencies,
        })
        .then((response) => {
          setExchangeRates(response.data);
        });
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

  const addCurrency = (currency) => {
    if (!currencies.includes(currency) && currencies.length < 7) {
      setCurrencies([...currencies, currency]);
    }
  };

  const removeCurrency = (currency) => {
    if (currencies.length > 3) {
      setCurrencies(currencies.filter((curr) => curr !== currency));
    }
  };
  const result = exchangeRates[selectedDate];
  return (
    <div>
      <h1>Exchange Rates</h1>
      <div>
        <label>Select Base Currency:</label>
        <select
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="INR">INR</option>
        </select>
      </div>
      <div>
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <table>
          <thead>
            <tr>
              <th>Currency</th>
              <th>Exchange Rate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currencies?.map((currency) => (
              <tr key={currency}>
                <td>{currency}</td>
                <td>{result[currency]}</td>
                <td>
                  <button onClick={() => removeCurrency(currency)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <label>Add Currency:</label>
        <select onChange={(e) => addCurrency(e.target.value)}>
          {Object.keys(result).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CurrencyExchange;
