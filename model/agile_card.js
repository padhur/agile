'use strict';
module.exports = (pTitle = '', pDescription = '', pPoints = 0) => {
   let title = pTitle;
   let description = pDescription;
   let points = pPoints;

   const getTitle = () => {
      return title;
   };

   const getDescription = () => {
      return description;
   };

   const getPoints = () => {
      return points;
   };

   const equals = (otherCard) => {
      return otherCard.getTitle() === title && otherCard.getDescription() === description;
   };

   return {
      getTitle,
      getDescription,
      getPoints,
      equals
   };
};