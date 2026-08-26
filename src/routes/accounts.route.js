const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const accountController = require('../controllers/accounts.controller');

const router = express.Router();

router.post("/", authMiddleware.authMiddleware, accountController.createAccount)

router.get("/", authMiddleware.authMiddleware, accountController.getAllAccountsController)

router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)

module.exports = router;