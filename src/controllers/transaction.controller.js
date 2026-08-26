const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const emailService = require('../services/email.service');
const mongoose = require('mongoose');

async function createTransaction(req, res) {
    /**
     * 1. Validate request
     */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "Missing required fields: fromAccount, toAccount, amount, idempotencyKey"
        });
    }

    const fromUserAccount = await accountModel.findById(fromAccount);
    const toUserAccount = await accountModel.findById(toAccount);

    if (!fromUserAccount || !toUserAccount) {
        return res.status(404).json({
            message: "One or both accounts not found."
        });
    }

    /**
     * 2. Validate Idempotency key
    */

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status == "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })
        }

        if (isTransactionAlreadyExists.status == "PENDING") {
            return res.status(200).json({
                message: "Transaction is still processing",
            })
        }

        if (isTransactionAlreadyExists.status == "FAILED") {
            return res.status(500).json({
                message: "Transaction processing failed , please retry",
            })
        }

        if (isTransactionAlreadyExists.status == "COMPLETED") {
            return res.status(500).json({
                message: "Transaction was reversed, please retry",
            })
        }
    }

    /**
     * 3. Check account status
     */

    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "both from and to accounts must be active."
        });
    }

    /** 
     * 4. Derive sender balance from ledger
     */

    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Current balance: ${balance}. Requested amount: ${amount}.`
        });
    }



    /**
     * 5. create transaction and ledger entries in a single transaction 
     */

    let transaction;

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        transaction = (await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session }))[0];

        const debitLedgerEntry = await ledgerModel.create([{
            account: fromAccount,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session });

        // await (() => {
        //     return new Promise((resolve) => setTimeout(resolve,100 * 1000));
        // });

        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session });

        transaction.status = "COMPLETED";

        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session }
        )

        await session.commitTransaction();
        session.endSession();
    } catch (error) {

        return res.status(400).json({
            message: "Transaction failed due to an internal error, please retry after some time.",
            error: error.message
        });
    }

    /**
     * 6. Send email notifications
     */

    await emailService.sendTransactionEmail(
        req.user.email,
        req.user.name,
        amount,
        fromAccount,
        toAccount
    );

    res.status(200).json({
        message: "Transaction completed successfully.",
        transaction: transaction
    });


}

async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "Missing required fields: toAccount, amount, idempotencyKey"
        });
    }

    const toUserAccount = await accountModel.findById(toAccount);

    if (!toUserAccount) {
        return res.status(404).json({
            message: "Account not found."
        });
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    });

    if (!fromUserAccount) {
        return res.status(404).json({
            message: "System account not found."
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    });

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session });

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session });

    transaction.status = "COMPLETED";

    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
        message: "Initial funds transaction completed successfully.",
        transaction: transaction
    });
}

module.exports = { createTransaction, createInitialFundsTransaction };