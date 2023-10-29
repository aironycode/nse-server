import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
const port = 3001; // or any port of your choice

app.get("/nse-data", async (req, res) => {
  try {
    const options = {
      method: "GET",
      url: "https://latest-stock-price.p.rapidapi.com/price",
      params: {
        Indices: "NIFTY 50",
        Identifier: "NIFTY 50",
      },
      headers: {
        "X-RapidAPI-Key": "9542875816msha44128afa9f6e07p12c059jsn0b94528ecb48",
        "X-RapidAPI-Host": "latest-stock-price.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);

    // Check if the response has data
    if (response.data && Array.isArray(response.data)) {
      // Find the object with the "identifier" property equal to "NIFTY 50"
      const niftyData = response.data.find(
        (item) => item.identifier === "NIFTY 50"
      );

      if (niftyData) {
        const nseData = niftyData.lastPrice;
        res.json(nseData);
      } else {
        res.status(404).json({ error: "NIFTY 50 not found in the response" });
      }
    } else {
      res.status(500).json({ error: "Invalid response format" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/bse-data", async (req, res) => {
  try {
    const options = {
      method: "GET",
      url: "https://indian-stock-exchange-api1.p.rapidapi.com/stock_price/",
      params: {
        symbol: "BSE",
      },
      headers: {
        "X-RapidAPI-Key": "c5ff370583msh0996147b09b0060p10a371jsn134055795bbb",
        "X-RapidAPI-Host": "indian-stock-exchange-api1.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    const bseData = response.data;
    console.log(bseData);
    // Extract the "previous_close" value from the BSE data
    const previousClose = bseData.last_trading_price;

    // Send the "previous_close" value as a JSON response
    res.json(previousClose);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
