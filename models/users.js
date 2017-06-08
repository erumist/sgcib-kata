var User = require('../schemas/user');
var mongoose = require('mongoose');
var moment = require('moment');

var UserModel = {};

UserModel.TRANSACTION = {
    DEPOSIT : 1,
    WITHDRAWAL : -1
}

UserModel.retrieveOneById = function(id, callback) {
  User.findById(id, function(err, data){
    if (err) {
      if (callback) {
        callback(err);
        return ;
      }
    }
    callback(data);
  });
}

UserModel.insertMove = function(id, transaction, callback) {
  var query = User.findByIdAndUpdate(
        id,
        {
          $push: {"transaction": transaction},
          $inc: {"amount": transaction.amount}
        },
        {safe: true, upsert: true, new : true},
        function(err, data) {
          if (err) {
            callback(null);
            return ;
          }
          callback(data);
        }
    );
}

module.exports = UserModel;
