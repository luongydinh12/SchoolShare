"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isEmpty = function isEmpty(value) {
  return value === undefined || value === null || _typeof(value) === 'object' && Object.keys(value).length === 0 || typeof value === 'string' && value.trim().length === 0;
};

module.exports = isEmpty;