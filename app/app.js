'use strict';
const Board = require('../agile_index').board;
const Card = require('../agile_index').card;

const printTransactionLog = (message) => {
    console.log(message);

    console.log('Start:');
    console.log(iteration.getCards(startColumn).map((card) => {
        return card.getTitle() + '; ' + card.getDescription() + '; ' + card.getPoints();
    }));
    console.log('In Progress:');
    console.log(iteration.getCards(inProgressColumn).map((card) => {
        return card.getTitle() + '; ' + card.getDescription() + '; ' + card.getPoints();
    }));
    console.log('Ready To Test:');
    console.log(iteration.getCards(verifyColumn).map((card) => {
        return card.getTitle() + '; ' + card.getDescription() + '; ' + card.getPoints();
    }));
    console.log('Done:');
    console.log(iteration.getCards(doneColumn).map((card) => {
        return card.getTitle() + '; ' + card.getDescription() + '; ' + card.getPoints();
    }));
    console.log(`Velocity: ${iteration.velocity()}`);
};

const startColumn = 'start';
const inProgressColumn = 'in_progress';
const verifyColumn = 'verify';
const doneColumn = 'done';
const card1 = Card('Card 1', 'Create card 1', 30);
const card2 = Card('Card 2', 'Create card 2', 50);
const card3 = Card('Card 3', 'Create card 3', 50);

const board = Board([startColumn, inProgressColumn, verifyColumn, doneColumn]);
const iteration = board.addnewIteration();

// Add 2 cards successfully. 
iteration.add(card1);
iteration.add(card2);
iteration.add(card3);
iteration.moveCard(card1, inProgressColumn);
iteration.moveCard(card2, inProgressColumn);
printTransactionLog('After moving 2 cards to in progress');

// Undo last move
iteration.undoLastMove();
printTransactionLog('\nAfter Undo');

// Move card2 back to in progress
iteration.moveCard(card2, inProgressColumn);
printTransactionLog('\nAfter moving the card back to in progress');

// Move two cards to verify
iteration.moveCard(card1, verifyColumn);
iteration.moveCard(card2, verifyColumn);
printTransactionLog('\nAfter moving to verify');

// Undo last move again
iteration.undoLastMove();
printTransactionLog('\nAfter Undo');

// Move cards to done
iteration.moveCard(card1, doneColumn);
iteration.moveCard(card2, doneColumn);
printTransactionLog('\nAfter moving to done');