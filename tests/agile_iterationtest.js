'use strict';
const assert = require('chai').assert;
const expect = require('chai').expect;
const Iteration = require('../model/agile_iteration');
const Card = require('../model/agile_card');
const ERRORS = require('../error/agile_errors');

   describe('add()', () => {
      it('must throw an error about undefined card', () => {
         const iteration = Iteration();
         try {
            iteration.add();
         } catch (error) {
            expect(error).to.equals(ERRORS.UNDEFINED_CARD);
         }
      });

      it('must add a card successfully with error', () => {
         const iteration = Iteration();
         try {
            iteration.add(Card());
            assert(true);
         } catch (error) {
            assert(false);
         }
      });
   });

   describe('iteration', () => {

    describe('create iteration', () => {
        it('must not allow column named as \'in_progress\'', () => {
            try {
                Iteration(['in_progress']);
            } catch (error) {
                expect(error).to.equals(ERRORS.INVALID_COLUMN);
            }
        });
    });

   describe('moveCard()', () => {
      it('should throw an error about card not defined', () => {
         const iteration = Iteration();
         const card = Card('title', 'desc', '1');
         try {
            iteration.add(card);
            iteration.moveCard(undefined, 'done');
         } catch (error) {
            expect(error).to.equals(ERRORS.UNDEFINED_CARD);
         }
      });

      it('must throw an error about card not found', () => {
         const iteration = Iteration();
         const card = Card('title', 'desc', '1');
         const cardToMove = Card('hello', 'world', '0');
         try {
            iteration.add(card);
            iteration.moveCard(cardToMove, 'done');
         } catch (error) {
            expect(error).to.equals(`${ERRORS.CARD_NOT_FOUND} ${cardToMove.getTitle()}`);
         }
      });

      it('must throw an error about column not found', () => {
         const iteration = Iteration();
         const cardToMove = Card('hello', 'world', '0');
         const toColumn = 'in_progress';
         try {
            iteration.moveCard(cardToMove, toColumn);
         } catch (error) {
            expect(error).to.equals(`${ERRORS.COLUMN_NOT_FOUND} ${toColumn}`);
         }
      });

      it('must move the card to start', () => {
         const iteration = Iteration();
         const card = Card('card one', 'desc', '1');
         const toColumn = 'start';

         iteration.add(card);
         iteration.moveCard(card, toColumn);

         const cards = iteration.getCards(toColumn);
         const cardIndex = cards.findIndex((c) => {
            return c.equals(card);
         });

         expect(cardIndex).to.equals(0);
      });

      it('must move the card to start and then to done', () => {
         const iteration = Iteration();
         const card = Card('card one', 'desc', '1');
         let startingColumn = 'start';
         let doneColumn = 'done';

         iteration.add(card);
         iteration.moveCard(card, startingColumn);

         let cards = iteration.getCards(startingColumn);
         let cardIndex = cards.findIndex((c) => {
            return c.equals(card);
         });

         iteration.moveCard(card, doneColumn);

         cards = iteration.getCards(doneColumn);
         cardIndex = cards.findIndex((c) => {
            return c.equals(card);
         });
         expect(cardIndex).to.equals(0);

         cards = iteration.getCards(startingColumn);
         cardIndex = cards.findIndex((c) => {
            return c.equals(card);
         });
         expect(cardIndex).to.equals(-1);
      });

      it('must not allow moving card2 to starting column as it exceeds the WIP limit', () => {
         const iteration = Iteration();
         const card1 = Card('card one', 'desc', '1');
         const card2 = Card('card two', 'desc', '3');
         let startingColumn = 'start';
         iteration.setWIP(startingColumn, 1);

         iteration.add(card1);
         iteration.moveCard(card1, startingColumn);

         iteration.add(card2);

         try {
            iteration.moveCard(card2, startingColumn);
         } catch (error) {
            expect(error).to.equals(`${ERRORS.WIP_EXCEPTION} ${startingColumn}`);
            expect(iteration.getCards(startingColumn)).to.deep.equals([card1]);
         }
      });
   });

   describe('velocity()', () => {
      it('should return 0', () => {
         const iteration = Iteration();
         const velocity = iteration.velocity();
         expect(velocity).to.equals(0);
      });

      it('should return 70', () => {
         const iteration = Iteration();
         const point1 = 40;
         const point2 = 30;
         const expectVelocity = point1 + point2;
         const card1 = Card('card 1', 'desc', point1);
         const card2 = Card('card 2', 'desc', point2);
         const doneColumn = 'done';

         iteration.add(card1);
         iteration.add(card2);
         iteration.moveCard(card1, doneColumn);
         iteration.moveCard(card2, doneColumn);

         const velocity = iteration.velocity();
         expect(velocity).to.deep.equals(expectVelocity);
      });
   });

   describe('undoLastMove()', () => {
      it('should do nothing', () => {
         const iteration = Iteration();
         try {
            iteration.undoLastMove();
         } catch (error) {
            assert(false, `Caught unexpected error: ${error}`);
         }
      });

      it('must do undo last move to done', () => {
         const iteration = Iteration();
         const card = Card('first card', 'first', '1');
         let startingColumn = 'start';
         let doneColumn = 'done';

         iteration.add(card);
         iteration.moveCard(card, startingColumn);
         iteration.moveCard(card, doneColumn);
         iteration.undoLastMove();

         let cards = iteration.getCards(startingColumn);
         let cardIndex = cards.findIndex((c) => {
            return c.equals(card);
         });

         expect(cardIndex).to.equals(0);

         cards = iteration.getCards(doneColumn);
         cardIndex = cards.findIndex((c) => {
            return c.equals(card);
         });
         expect(cardIndex).to.equals(-1);

         // undo again, should have no effect
         iteration.undoLastMove();

         cards = iteration.getCards(startingColumn);
         cardIndex = cards.findIndex((c) => {
            return c.equals(card);
         });

         expect(cardIndex).to.equals(0);

         cards = iteration.getCards(doneColumn);
         cardIndex = cards.findIndex((c) => {
            return c.equals(card);
         });
         expect(cardIndex).to.equals(-1);
      });
   });

   describe('setWIP()', () => {
      it('must throw error about column not found', () => {
         const iteration = Iteration();
         const column = 'Hello';
         try {
            iteration.setWIP(column, 1);
         } catch (error) {
            expect(error).to.equals(`${ERRORS.COLUMN_NOT_FOUND} ${column}`);
         }
      });

      it('must throw error about WIP is invalid', () => {
         const iteration = Iteration();
         const column = 'start';
         const wip = -1;
         try {
            iteration.setWIP(column, wip);
         } catch (error) {
            expect(error).to.equals(`${ERRORS.INVALID_WIP} ${wip}`);
         }
      });
   });
});