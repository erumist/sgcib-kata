var Mongoose = require('mongoose-q')(require('mongoose'));
var q = require('q');

/*
  Transaction type
  {
    _id,
    date,
    amount
  }
*/

var userSchema = new Mongoose.Schema({
    amount:{
      type: Number,
      default: 0
    },
    transaction: {
        type: Array,
        default: []
    }
});

module.exports = User = Mongoose.model("User", userSchema);
