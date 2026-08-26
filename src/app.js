const express = require('express');
const userRouter = require('../src/routes/auth.route');
const accountRouter = require('../src/routes/accounts.route');
const transactionRouter = require('../src/routes/transaction.route');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',userRouter);
app.use('/api/accounts',accountRouter);
app.use('/api/transactions',transactionRouter);

module.exports = app;