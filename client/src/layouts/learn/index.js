import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useEffect, useRef, useState } from "react";
import "./Graph.css";
import axios from "axios";

let tvScriptLoadingPromise;

function LearnDashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState("NASDAQ:AAPL");
  //const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Get the token from localStorage
    const jwtCookie = localStorage.getItem("jwt");
    axios
      .get("http://localhost:4337/checkAuthentication", {
        headers: {
          Authorization: `Bearer ${jwtCookie}`,
        },
      })
      .then((response) => {
        console.log(response.data.status);
        // If the response status is "ok", the user is authenticated
        if (response.data.status != "ok") {
          //setIsLoggedIn(true);
          window.location.href = "/pages/authentication/sign-in";
        }
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
        //setIsLoggedIn(false);
        window.location.href = "/pages/authentication/sign-in";
      });
  }, []);

  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

    return () => (onLoadScriptRef.current = null);
  }, []);

  useEffect(() => {
    // Whenever the selectedSymbol changes, update the TradingView widget
    createWidget();
  }, [selectedSymbol]);

  function createWidget() {
    if (document.getElementById("tradingview_89d4a") && "TradingView" in window) {
      new window.TradingView.widget({
        autosize: true,
        symbol: selectedSymbol,
        interval: "1",
        timezone: "Etc/UTC",
        theme: "light",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_side_toolbar: false,
        //allow_symbol_change: true,
        container_id: "tradingview_89d4a",
      });
    }
  }

  const handleSymbolChange = (event) => {
    setSelectedSymbol(event.target.value);
  };

  return (
    <DashboardLayout>
      <div className="tradingview-widget-container">
        <div>
          <label htmlFor="symbolSelect">Select Symbol: </label>
          <select id="symbolSelect" value={selectedSymbol} onChange={handleSymbolChange}>
            <option value="NASDAQ:AAPL">AAPL</option>
            <option value="NYSE:TSE">NYSE:TSE</option>
            <option value="BSE:SENSEX">BSE:SENSEX</option>
            <option value="LSE:IBM">LSE:IBM</option>
            {/* Add more symbols as needed */}
          </select>
        </div>
        <div id="tradingview_89d4a" />
        <div className="tradingview-widget-copyright">
          {/* <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a> */}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default LearnDashboard;
