'use strict';
const expect = require('chai').expect;
const Card = require('../model/agile_card');

describe('card', () => {
   describe('create card', () => {
      it('create a card with title as \'Card 1\', description as \'implement GATE Logic\' and point as 100', () => {
         const title = 'Card 1';
         const description = 'implement GATE Logic';
         const point = 100;
         const card = Card(title, description, point);

         expect(card.getTitle()).to.equals(title);
         expect(card.getDescription()).to.equals(description);
         expect(card.getPoints()).to.equals(point);
      });
   });

   describe('compare card', () => {
      it('equals to the other card when titles and descriptions are the same', () => {
         const title = 'Card 1';
         const description = 'implement GATE Logic';
         const point = 100;
         const card = Card(title, description, point);
         const otherCard = Card(title, description, point);

         expect(card.equals(otherCard)).to.be.true;
      });

      it('card 1 not equal to the other card when the title is different', () => {
         const title = 'Card 1';
         const description = 'implement GATE Logic';
         const point = 100;
         const card = Card(title, description, point);
         const otherCard = Card('Card 2', description, point);

         expect(card.equals(otherCard)).to.be.false;
      });

   });
});