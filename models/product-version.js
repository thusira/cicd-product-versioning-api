var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductVersionSchema = new Schema({
  productVersion: {
    type: String,
    required: 'Kindly enter the product version'
  },
  isCurrent: Boolean,
  environment: {
    type: String
  },
  servicesJson: {
    type: String
  },
  basedOn: {
    type: String
  },
  triggeredModule: {
    type: String
  },
  createdDate: {
    type: Date
  }
}, {
  collection: 'ProductVersions'
});

module.exports = mongoose.model('ProductVersion', ProductVersionSchema);