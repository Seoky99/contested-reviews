Maintaining the website: 

Adding a set 
    In populateDB.js, add sets by calling populateSet(MAIN_SET_CODE, HAS_BONUS_SHEET); 
    If a set has a bonus sheet, in bonusCodeConfig, add a mapping from MAIN_SET_CODE -> [BONUS_SET_CODE, ...];

Updating a set as spoilers come out: This will also update the bonus sheets.
    Call updateSetReviews(MAIN_SET_CODE);

Query all draftable cards with: 
set:SETNAME+in:booster
  Examples: 
    const URL = 'https://api.scryfall.com/sets/fin';
    const URLTWO = 'https://api.scryfall.com/cards/search?q=set%3Afin%2Bin%3Abooster'; 
