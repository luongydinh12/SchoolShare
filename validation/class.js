const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateClassInput(data) {
  let errors = {};
  
  data.title = !isEmpty(data.title) ? data.title : '';
  data.term = !isEmpty(data.term) ? data.term : '';

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Class title field is required';
  }

  if (Validator.isEmpty(data.term)) {
    errors.term = 'Term field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
