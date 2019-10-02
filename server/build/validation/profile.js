"use strict";

var Validator = require('validator');

var isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  var errors = {};
  data.handle = !isEmpty(data.handle) ? data.handle : '';

  if (!Validator.isLength(data.handle, {
    min: 2,
    max: 40
  })) {
    errors.handle = 'Handle needs to between 2 and 4 characters';
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = '*** Profile handle is required';
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};