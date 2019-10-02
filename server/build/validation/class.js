"use strict";

var Validator = require('validator');

var isEmpty = require('./is-empty');

module.exports = function validateClassInput(data) {
  var errors = {};
  data.title = !isEmpty(data.title) ? data.title : '';
  data.term = !isEmpty(data.term) ? data.term : '';

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Class title field is required';
  }

  if (Validator.isEmpty(data.term)) {
    errors.term = 'Term field is required';
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};