import React, { useState } from "react";
import Auth from "./components/Auth";
import Wallet from "./components/Wallet";
import TransactionHistory from "./components/TransactionHistory";  // Import the new component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("access_token") !== null);


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4 fixed w-full top-0 left-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
          <h1 className="text-3xl font-semibold">🏦 Banking Dashboard</h1>
          {isAuthenticated && (
            <button
              className="bg-red-600 px-4 py-2 rounded-md"
              onClick={() => {
                localStorage.removeItem("access_token");
                setIsAuthenticated(false);
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <div className="pt-20"> {/* Adding padding to the content so it's not covered by the navbar */}
        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-4">
          {isAuthenticated ? (
            <div>
              {/* Balance - Positioned at the top */}
              <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
                <Wallet />
              </div>

              {/* Transaction History */}
              <div className="bg-white shadow-lg rounded-xl p-6">
                <TransactionHistory /> {/* Display transaction history */}
              </div>
            </div>
          ) : (
            <Auth setIsAuthenticated={setIsAuthenticated} />
          )}
        </div>
      </div>
    </div>
  );
}


export default App;
