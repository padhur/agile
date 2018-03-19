'use strict';
const Iteration = require('./agile_iteration');
const ERRORS = require('../error/agile_errors');
const MANDATORY_COLUMNS = ['start', 'done'];

module.exports = (columns = []) => {
   let iteration;

   const addnewIteration = () => {
      // check for the mandatory columns
      // before creating a new iteration
      if (MANDATORY_COLUMNS.filter((elem) => {
         return columns.includes(elem);
      }).length == MANDATORY_COLUMNS.length) {
         iteration = Iteration(columns);
         return iteration;
      } else {
         throw ERRORS.MANDATORY_COLUMNS_MISSING;
      }
   };

   const getIteration = () => {
      return iteration;
   };

   return {
      addnewIteration,
      getIteration
   };
};