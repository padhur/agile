'use strict';
const ERRORS = require('../error/agile_errors');

const DEFAULT_WIP = '100';
const START_COLUMN = 'start';
const DONE_COLUMN = 'done';
const INPROGRESS_COLUMN = 'inprogress';

module.exports = (columnNames = [START_COLUMN, DONE_COLUMN]) => {
   let columns = {};
   let lastMove = {
      card: undefined,
      column: undefined,
   };

   /* Private Functions */
   const init = () => {
      for (let col of columnNames) {
         // Do not allow a colunmn name to be the same as the inprogress column
         if (col === INPROGRESS_COLUMN) {
            throw (ERRORS.INVALID_COLUMN);
         }

         columns[col] = {
            points: 0,
            cards: [],
            WIP: DEFAULT_WIP,
         };
      }

      columns[INPROGRESS_COLUMN] = {
         points: 0,
         cards: [],
         WIP: Number.POSITIVE_INFINITY,
      };
      columnNames.push(INPROGRESS_COLUMN);
   };

   init();

   const saveLastMove = (card, column) => {
      lastMove.card = card;
      lastMove.column = column;
   };

   const resetLastMove = () => {
      lastMove.card = undefined;
      lastMove.column = undefined;
   };

   const reteriveCard = (card) => {
      let result;
      for (let colName of columnNames) {
         let col = columns[colName];
         let index = col.cards.findIndex((otherCard) => {
            return card.equals(otherCard);
         });
         if (index > -1) {
            result = {};
            result.card = col.cards[index];
            result.column = colName;
            result.index = index;
            break;
         }
      }
      return result;
   };

   const removeCard = (col, index) => {
      const cardRemoved = columns[col].cards[index];
      columns[col].cards.splice(index, 1);
      columns[col].points -= cardRemoved.getPoints();
      saveLastMove(cardRemoved, col);
      return cardRemoved;
   };

   const validateWIP = (addtionalPoints, columnName) => {
      const col = columns[columnName];
      return col.points + addtionalPoints > col.WIP;
   };

   /* Public Functions */
   const add = (card) => {
      if (card) {
         columns[INPROGRESS_COLUMN].cards.push(card);
      } else {
         throw (ERRORS.UNDEFINED_CARD);
      }
   };

   const moveCard = (card, toColumn) => {
      if (!card) {
         throw (ERRORS.UNDEFINED_CARD);
      } else if (!columns[toColumn]) {
         throw (`${ERRORS.COLUMN_NOT_FOUND} ${toColumn}`);
      }

      const result = reteriveCard(card);
      if (!result) {
         throw (`${ERRORS.CARD_NOT_FOUND} ${card.getTitle()}`);

      } else if (validateWIP(result.card.getPoints(), toColumn)) {
         throw (`${ERRORS.WIP_EXCEPTION} ${toColumn}`);

      } else {
         let cardToMove = removeCard(result.column, result.index);
         let column = columns[toColumn];
         column.cards.push(cardToMove);
         column.points += cardToMove.getPoints();
      }
   };

   const undoLastMove = () => {
      if (!lastMove.card) {
         return;
      }

      moveCard(lastMove.card, lastMove.column);
      resetLastMove();
   };

   const getCards = (column) => {
      if (!columns[column]) {
         throw (`${ERRORS.COLUMN_NOT_FOUND} ${column}`);
      }

      return columns[column].cards;
   };

   const setWIP = (column, wip) => {
      if (!columns[column]) {
         throw (`${ERRORS.COLUMN_NOT_FOUND} ${column}`);
      } else if (wip < 0){
         throw (`${ERRORS.INVALID_WIP} ${wip}`);
      }

      columns[column].WIP = wip;
   };

   const velocity = () => {
      return columns[DONE_COLUMN].points;
   };

   return {
      add,
      moveCard,
      undoLastMove,
      velocity,
      getCards,
      setWIP,
   };
};