var UserModel = require('../models/users.js');
var mongoose = require('mongoose');

var UserController = {};

UserController.ERROR = {
  MORE_PARAMETERS: "More parameters needed",
  AMOUNT_NEGATIVE: "Deposit amount can't be negative",
  INVALID_ID: "Invalid ObjectID",
  USER_NFOUND: "User not found",
  AMOUNT_NOT_ZERO: "Number is excepted as amount and should be != 0",
  WITHDRAWAL_POSITIVE: "Withdrawal amount is positive",
  NO_MONEY: "Not enough money on account",
  ERR_TRANSACTION: "An error occured while saving the transaction"
}

function sendError(res, error) {
  res.status(400).send({error: error});
}

function sendOk(res, data) {
  res.status(200).send(data);
}

UserController.history = function(req, res, next) {
  if (!req.query.id) {
    sendError(res, UserController.ERROR.MORE_PARAMETERS);
    return ;
  }
  var id = req.query.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    sendError(res, UserController.ERROR.INVALID_ID);
    return ;
  }

  var user = UserModel.retrieveOneById(id, function (data) {
    if (!data ) {
      sendError(res, UserController.ERROR.USER_NFOUND);
      return;
    }
    data.transaction.reverse();
    sendOk(res, data);
  });
};

UserController.transaction = function(req, res, next) {
  if (!req.body.transaction || !req.body.transaction.idUser || !req.body.transaction.type) {
     sendError(res, UserController.ERROR.MORE_PARAMETERS);
     return ;
  }

  var transaction = req.body.transaction;
  transaction.amount = parseInt(transaction.amount) || 0;

  if (!transaction.amount) {
    sendError(res, UserController.ERROR.AMOUNT_NOT_ZERO);
    return ;
  }

  transaction.amount = parseInt(transaction.amount);

  if (transaction.type === UserModel.TRANSACTION.DEPOSIT && transaction.amount < 0) {
    sendError(res, UserController.ERROR.AMOUNT_NEGATIVE);
    return ;
  }

  if (transaction.type === UserModel.TRANSACTION.WITHDRAWAL && transaction.amount > 0) {
    sendError(res, UserController.ERROR.WITHDRAWAL_POSITIVE);
    return ;
  }

  var user = UserModel.retrieveOneById(transaction.idUser, function(data) {
    if (!data) {
      sendError(res, UserController.ERROR.USER_NFOUND);
      return ;
    }

    if (transaction.type === UserModel.TRANSACTION.WITHDRAWAL) {
      if (transaction.amount < data.amount * -1) {
        sendError(res, UserController.ERROR.NO_MONEY);
        return ;
      }
    }
      var idUser = transaction.idUser;
      delete transaction.idUser;

      var user = UserModel.insertMove(idUser, transaction, function(data) {
        if (!data) {
          sendError(res, ERR_TRANSACTION);
          return ;
        }
        sendOk(res, data);
      });

  })

};

module.exports = UserController;
