import express from "express";
import axios from "axios";
import cors from "cors";
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import smtpTransport from 'nodemailer-smtp-transport';


const app = express();
app.use(cors());
const port = 3001; // or any port of your choice


app.use(bodyParser.json());
// Use sendMail here
// Create a transporter using your email service provider's settings
// const transporter = nodemailer.createTransport({
//   host: 'webmail.aartechsolonics.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: "info@aartechsolonics.com",
//     pass: "Info@aartech2023",
//   },
// });

const transporter = nodemailer.createTransport(smtpTransport({
  host: 'webmail.aartechsolonics.com',
  secureConnection: false,
  tls: {
    rejectUnauthorized: false
  },
  port: 587,
  auth: {
    user: "info@aartechsolonics.com",
    pass: "Info@aartech2023",
  }
}));

app.post('/sendEmail', (req, res) => {
  const { name, email, message, companyName, lastName, salutation, country } = req.body;

  const mailOptions = {
    from: email,
    to: ['info@aartechsolonics.com'],
    subject: 'Contact Form Submission',
    text: `Name: ${salutation} ${name} ${lastName}\nCountry: ${country}\nCompany: ${companyName}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email could not be sent:', error);
      res.status(500).send('Email could not be sent');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});


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
