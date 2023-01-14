const ccxt = require('ccxt');

// Connect to the trading platform's API
const exchange = new ccxt.kraken();

// Define the stock symbol and time intervals
const symbol = 'BTC/USD';
const shortInterval = 50;
const longInterval = 200;

// Retrieve historical data for the stock
const historicalData = await exchange.fetchOHLCV(symbol);

// Calculate the moving averages
const shortMovingAverage = calculateMovingAverage(historicalData, shortInterval);
const longMovingAverage = calculateMovingAverage(historicalData, longInterval);

// Initialize the current position as "none"
let currentPosition = "none";

// Iterate through the historical data
for (let i = 0; i < historicalData.length; i++) {
    // Check if the short moving average has crossed above the long moving average
    if (shortMovingAverage[i] > longMovingAverage[i] && shortMovingAverage[i - 1] <= longMovingAverage[i - 1]) {
        // If so, and the current position is "none" or "sold", buy the stock
        if (currentPosition === "none" || currentPosition === "sold") {
            currentPosition = "bought";
            console.log("Bought " + symbol + " at " + historicalData[i].close);
        }
    }
    // Check if the short moving average has crossed below the long moving average
    else if (shortMovingAverage[i] < longMovingAverage[i] && shortMovingAverage[i - 1] >= longMovingAverage[i - 1]) {
        // If so, and the current position is "bought", sell the stock
        if (currentPosition === "bought") {
            currentPosition = "sold";
            console.log("Sold " + symbol + " at " + historicalData[i].close);
        }
    }
}

// Helper function to calculate moving averages
function calculateMovingAverage(data, interval) {
    const movingAverages = [];
    for (let i = 0; i < data.length; i++) {
        if (i < interval) {
            movingAverages.push(null);
        } else {
            let sum = 0;
            for (let j = i - interval; j < i; j++) {
                sum += data[j].close;
            }
            movingAverages.push(sum / interval);
        }
    }
    return movingAverages;
}
