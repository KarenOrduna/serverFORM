require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

console.log(process.env.GMAIL_ACCOUNT);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PASS,
  },
});

app.post('/contact', (req, res) => {
  const { name, message, email } = req.body;
  const { apiKey } = req.query;
  if (apiKey !== process.env.API_KEY) {
    res.status(401);
    res.json({ error: 'wrong API key' });
  }

  const mailOptions = {
    from: process.env.GMAIL_ACCOUNT,
    to: process.env.GMAIL_ACCOUNT,
    subject: `Demande de contact de ${name}`,
    text: `${name} (${email}) vous a fait une demande de contact : \n\n${message}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
      res.status(500);
      res.json({
        errorMessage:
          'There was a problem while sending the contact request email to the admin',
      });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ message: 'demande de contact envoyée avec succès' });
    }
  });
});

app.post('/order', (req, res) => {
  const { apiKey } = req.query;
  if (apiKey !== process.env.API_KEY) {
    res.status(401);
    res.json({ error: 'wrong API key' });
  }

  const mailOptions = {
    from: process.env.GMAIL_ACCOUNT,
    to: process.env.GMAIL_ACCOUNT,
    subject: `Nouvelle commande `,
    text: `Vous avez reçu une nouvelle commande composée de :
    ${req.body
      .map((product) => `${product.product} : ${product.quantity} unités`)
      .join('\n')}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
      res.status(500);
      res.json({
        errorMessage: 'There was a problem while sending the basket',
      });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ message: 'Panier envoyé avec succès' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`server listenting on port ${PORT}`);
});
