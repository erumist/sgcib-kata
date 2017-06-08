process.env.NODE_ENV = 'test';

var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var User = require('../schemas/user');
var UserModel = require('../models/users');
var UserController = require('../controllers/users');
mongoose.Promise = global.Promise;

describe('User', function() {

  var url = 'http://localhost:3000';
  var user = {};
  var app = {};

  // before(function(done) {
  //   mongoose.connect("mongodb://localhost:27017/sgicb", function(err) {
  //       if (err) {
  //           console.log("FATAL ERROR : MONGODB INIT FAILED!!! ", err);
  //       }
  //     var u = new User({amount:100});
  //     u.saveQ().then(function (data){
  //        user = data;
  //       done();
  //     });
  //   });
  // });

  before(function(done) {
    app = require('../app');
    var u = new User({amount:100});
        u.saveQ().then(function (data){
           user = data;
          done();
        });
    // done();
  });

  describe('Deposit', function() {
    it('should make a deposit of 100', function(done) {
      var transaction = {
        transaction : {
          idUser: user._id,
          type: UserModel.TRANSACTION.DEPOSIT,
          amount: 100
        }
      }
      request(app).post('/users/transaction')
      .send(transaction)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.body._id.should.equal(user._id.toString());
        res.body.amount.should.equal(200);
        res.body.transaction[0].amount.should.equal(100);
        res.body.transaction[0].type.should.equal(UserModel.TRANSACTION.DEPOSIT);
        done();
      });
    });
    it('should fail a deposit of -100', function(done) {
      var transaction = {
        transaction : {
          idUser: user._id,
          type: UserModel.TRANSACTION.DEPOSIT,
          amount: -100
        }
      }
      request(app).post('/users/transaction')
      .send(transaction)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.body.error.should.equal(UserController.ERROR.AMOUNT_NEGATIVE);
        res.statusCode.should.equal(400);
        done();
      });
    });
    it('should fail a deposit of 0', function(done) {
      var transaction = {
        transaction : {
          idUser: user._id,
          type: UserModel.TRANSACTION.DEPOSIT,
          amount: 0
        }
      }
      request(app).post('/users/transaction')
      .send(transaction)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.body.error.should.equal(UserController.ERROR.AMOUNT_NOT_ZERO);
        res.statusCode.should.equal(400);
        done();
      });
    });
    it('should fail a deposit because of bad parameters', function(done) {
      var transaction = {
        transaction : {
          type: UserModel.TRANSACTION.DEPOSIT,
          amount: 0
        }
      }
      request(app).post('/users/transaction')
      .send(transaction)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.body.error.should.equal(UserController.ERROR.MORE_PARAMETERS);
        res.statusCode.should.equal(400);
        done();
      });
    });
  });

  describe('Withdrawal', function() {
    it('should make a withdrawal of 100', function(done) {
      var transaction = {
        transaction : {
          idUser: user._id,
          type: UserModel.TRANSACTION.WITHDRAWAL,
          amount: -100
        }
      }
      request(app).post('/users/transaction')
      .send(transaction)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.body._id.should.equal(user._id.toString());
        res.body.amount.should.equal(100);
        res.body.transaction[1].amount.should.equal(-100);
        res.body.transaction[1].type.should.equal(UserModel.TRANSACTION.WITHDRAWAL);
        done();
      });
    });
    it('should fail a withdrawal of 200', function(done) {
      var transaction = {
        transaction : {
          idUser: user._id,
          type: UserModel.TRANSACTION.WITHDRAWAL,
          amount: -200
        }
      }
      request(app).post('/users/transaction')
      .send(transaction)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.body.error.should.equal(UserController.ERROR.NO_MONEY);
        res.statusCode.should.equal(400);
        done();
      });
    });
    it('should fail a withdrawal of 0', function(done) {
      var transaction = {
        transaction : {
          idUser: user._id,
          type: UserModel.TRANSACTION.WITHDRAWAL,
          amount: 0
        }
      }
      request(app).post('/users/transaction')
      .send(transaction)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.body.error.should.equal(UserController.ERROR.AMOUNT_NOT_ZERO);
        res.statusCode.should.equal(400);
        done();
      });
    });
    it('should fail a deposit because of bad parameters', function(done) {
      var transaction = {
        transaction : {
          type: UserModel.TRANSACTION.WITHDRAWAL,
          amount: 0
        }
      }
      request(app).post('/users/transaction')
      .send(transaction)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.body.error.should.equal(UserController.ERROR.MORE_PARAMETERS);
        res.statusCode.should.equal(400);
        done();
      });
    });
  });

  describe('History', function() {
    it('should return user with 2 transactions and 100 in balance', function(done) {
      request(app).get('/users/history?id='+user._id)
      .send()
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.statusCode.should.equal(200);
        res.body.amount.should.equal(100);
        res.body.transaction[0].amount.should.equal(-100);
        res.body.transaction[0].type.should.equal(UserModel.TRANSACTION.WITHDRAWAL);
        res.body.transaction[1].amount.should.equal(100);
        res.body.transaction[1].type.should.equal(UserModel.TRANSACTION.DEPOSIT);
        done();
      });
    });
    it('should return user not found', function(done) {
      request(app).get('/users/history?id='+mongoose.Types.ObjectId())
      .send()
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.body.error.should.equal(UserController.ERROR.USER_NFOUND);
        res.statusCode.should.equal(400);
        done();
      });
    });

    it('should return invalid id', function(done) {
      request(app).get('/users/history?id=a')
      .send()
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.body.error.should.equal(UserController.ERROR.INVALID_ID);
        res.statusCode.should.equal(400);
        done();
      });
    });
  });
})
