'use strict';
const assert = require('chai').assert;
const expect = require('chai').expect;
const Board = require('../model/agile_board');
const ERRORS = require('../error/agile_errors');

describe('Board', () => {
   describe('addnewIteration()', () => {
      it('should resolve an iteration', () => {
         const board = Board(['start', 'in_progress', 'done']);
         try {
            const result = board.addnewIteration();
            expect(result).to.not.be.undefined;
         } catch (error) {
            assert(false);
         }
      });

      it('reject with error when a board has no \'start\' and \'done\' column', () => {
         const board = Board(['in_progress']);
         try {
            board.addnewIteration();
         } catch (error) {
            return expect(error).to.equals(ERRORS.MANDATORY_COLUMNS_MISSING);
         }
      });
   });

    it('should reject with error when a board has only \'done\' column', () => {
        const board = Board(['done']);
        try {
            board.addnewIteration();
        } catch (error) {
            expect(error).to.equals(ERRORS.MANDATORY_COLUMNS_MISSING);
        }
    });

    it('reject with error when a board has only \'start\' column', () => {
        const board = Board(['start']);
        try {
            board.addnewIteration();
        } catch (error) {
            expect(error).to.equals(ERRORS.MANDATORY_COLUMNS_MISSING);
        }
    });

   describe('getIteration()', () => {
      it('must return undefined', () => {
         const board = Board();
         const iteration = board.getIteration();
         expect(iteration).to.be.undefined;
      });

      it('must return an defined iteration', () => {
         const board = Board(['start', 'in_progress', 'done']);
         const iteration = board.addnewIteration();
         expect(iteration).to.not.be.undefined;
      });
   });
});