import client from '../client.js';
import setImageConfig from './setImageConfig.js';
import bonusCodeConfig from './bonusCodeConfig.js';

//Update the cards as they get spoiled by running addCards(url);

/**
 * Fetches set information or cards for a given URL 
 * @param {string} url - The Scryfall API URL to fetch  
 * @param {string} searchTarget - Returns an array of data objects depending on searchTarget: (set, cards, randomArtCrop) 
 * @returns {Promise<object[]>} - Returns the set data as an array for sets, json.data for cards
 */
async function fetchScryfall(url, searchTarget) {
  try {
    let hasMore = true;
    const data = [];

    do {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        console.log('Scryfall response failure');
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();

      switch (searchTarget) {
        case 'set':
          data.push({ id: json.id, code: json.code, name: json.name});
          break; 
        case 'cards':
          data.push(...json.data)
          break; 
        case 'randomArtCrop':
          data.push({artCrop: json.art_crop})
          break;
        default:
          throw new Error("Check your searchTarget");
      }

      hasMore = json.has_more;

      if (hasMore) {
        url = json.next_page;
      }
    } while (hasMore);

    return data;

  } catch (err) {
    console.log('server failure' + err);
  }
}

/**
 * Fetches a random art crop from any card belonging to the set 
 * @param {string} setCode 
 * @returns URL to the image 
 */
async function fetchRandomArtCropFromSet(setCode) {
    const url = `https://api.scryfall.com/cards/random?q=set%3A${setCode}`;
    const data = fetchScryfall(url, 'randomArtCrop');

    return (await data)[0].artCrop;
}

/**
 * Adds the connection of the bonus set to the main set (have to manually do this unluck)
 * @param {string} setCode 
 * @param {string} bonusCode 
 */
async function addBonusLink(setCode, bonusCode) {

  const query = `INSERT INTO bonus_links(main_set_id, bonus_set_id) VALUES ( 
    (SELECT set_id FROM sets WHERE set_code = $1), 
    (SELECT set_id FROM sets WHERE set_code = $2))`;
  
  const dataArray = [setCode.toLowerCase(), bonusCode.toLowerCase()]; 
  await useClient(query, dataArray);
}

/**
 * Adds the set information to the sets table in the database  
 * @param {string} setcode - Setcode of the set you are inserting (pass in bonus code here if adding bonus set)
 * @param {boolean} isBonus - Whether you are inserting a bonus set 
 * @param {string} associatedCode - If you are adding a bonus set, this is the set code
 */
async function addSet(setCode, isBonus, associatedCode) {

  if (isBonus && associatedCode === null) {
    throw new Error('include the bonus code as well if isBonus');
  }

  setCode = setCode.toLowerCase();

  const url = `https://api.scryfall.com/sets/${setCode}`;
  const query = `INSERT INTO sets(set_id, set_code, name, is_bonus, set_img) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (set_id) DO NOTHING`;
  let dataArray = []; 

  const { id, code, name} = (await fetchScryfall(url, 'set'))[0]; 
  dataArray.push(id, code, name, isBonus);

   //check if art crop is specified, otherwise fetch a random one  
  if (setCode in setImageConfig) {
      dataArray.push(setImageConfig[setCode]);
  } else {
      dataArray.push(await fetchRandomArtCropFromSet(setCode)); 
  }

  await useClient(query, dataArray);

  if (isBonus) {
    await addBonusLink(associatedCode, setCode);
  }
}

/**
 * Adds the cards to the cards table in the database
 * @param {string} url - Scryfall API URL  
 */
async function addCards(setCode) {
  setCode = setCode.toLowerCase(); 
  const url = `https://api.scryfall.com/cards/search?q=set%3A${setCode}%2Bin%3Abooster`;

  const data = await fetchScryfall(url, 'cards');
  let query = `INSERT INTO cards(card_id, set_id, cmc, colors, name, image_urls, rarity, type_line, keywords, artist) VALUES`;
  const dataArray = [];
  let count = 0;
  const numColsInserted = 10;

  //Generates a query VALUES($1, $2, .... $colCount), ($colCount + 1...) for each card  
  data.forEach((card, i) => {
    let querySegment = `(`;

    for (let colCount = 0; colCount < numColsInserted; colCount++) {
      count++;
      querySegment += `$${count}${colCount === numColsInserted - 1 ? `` : `, `}`;
    }

    querySegment += `)${i === data.length - 1 ? `` : `,`}`;
    query += querySegment;

    //handling of multi-face cards >:( i hate them 
    //Some cards have card_faces component but have image_uris in "main" card - 

    let images = [];
    if (card.image_uris) {
      images.push(card.image_uris.normal);
    } else {
      card.card_faces.forEach(face => images.push(face.image_uris.normal)); 
    }

    dataArray.push(
      card.id,
      card.set_id,
      Number(card.cmc),
      card.colors,
      card.name,
      images,
      card.rarity,
      card.type_line,
      card.keywords,
      card.artist,
    );
  });

  //handles cards already added as cards get spoiled
  query += ` ON CONFLICT (card_id) DO NOTHING`;

  await useClient(query, dataArray);
}

async function updateSetReviews(setId) {

  await client.connect(); 

  //refactor 
  const matchingQuery = `
    INSERT INTO reviews (user_set_id, card_id)
    SELECT
      us.user_set_id,
      c.card_id
    FROM
      user_sets us
    JOIN cards c
      ON us.set_id = c.set_id
    LEFT JOIN reviews r
      ON r.user_set_id = us.user_set_id
      AND r.card_id = c.card_id
    WHERE
      us.set_id = $1
      AND r.review_id IS NULL;
    `; 

    const matchingBonusQuery = `
    INSERT INTO reviews (user_set_id, card_id)
    SELECT
      us.user_set_id,
      c.card_id
    FROM
      user_sets us
    JOIN bonus_links bl
      ON bl.main_set_id = us.set_id
    JOIN cards c
      ON c.set_id = bl.bonus_set_id
    LEFT JOIN reviews r
      ON r.user_set_id = us.user_set_id
      AND r.card_id = c.card_id
    WHERE
      us.set_id = $1
      AND us.includes_bonus = TRUE
      AND r.review_id IS NULL;
    `; 

    //update only defaultApplied sets 
    const defaultAppliedQuery = `
    UPDATE reviews 
     SET rank = CASE
      WHEN cards.rarity = 'common' THEN 'C'
      WHEN cards.rarity = 'uncommon' THEN 'B'
      WHEN cards.rarity = 'rare' THEN 'A'
      WHEN cards.rarity = 'mythic' THEN 'S'
      ELSE 'C'
    END
    FROM user_sets, cards 
    WHERE reviews.user_set_id = user_sets.user_set_id AND reviews.card_id = cards.card_id AND
    user_sets.default_applied = TRUE AND reviews.rank IS NULL AND user_sets.set_id = $1;
    `; 

    const nonRatedQuery = `
      UPDATE reviews 
      SET rank = 'NR'
      FROM user_sets
      WHERE reviews.user_set_id = user_sets.user_set_id AND
      user_sets.default_applied = FALSE AND reviews.rank IS NULL AND user_sets.set_id = $1;
    `; 

    await useClient(matchingQuery, [setId]);
    await useClient(matchingBonusQuery, [setId]);
    await useClient(defaultAppliedQuery, [setId]);
    await useClient(nonRatedQuery, [setId]);

    await client.end(); 
}

async function useClient(query, dataArray) {
  try {
    await client.query(query, dataArray);
  } catch (err) {
    console.log(err);
  } 
}

/**
 * Initializes set and its cards. Add its associated bonus set with addBonus.
 * If you wish to enter a bonus set separately, (perhaps a bonus is announced late into set reviews): 
 * call addSet(bonusCode, true, setCode); addCards(bonusCode); separately 
 * @param {string} setCode 
 * @param {boolean} addBonus 
 */
async function populateSet(setCode, addBonus=false) {

    setCode = setCode.toLowerCase();

    if (addBonus && bonusCodeConfig[setCode] === null) {
      throw new Error("Supply an associated bonus code in bonusCodeConfig.js please");
    }

    const bonusCodes = bonusCodeConfig[setCode];
    console.log(bonusCodes);

    try {
      await client.connect();

      if (addBonus) {
        await addSet(setCode, false); 
        await addCards(setCode); 

        for (const bonusCode of bonusCodes) {
          await addSet(bonusCode, true, setCode);
          await addCards(bonusCode);
        }

      } else {
        await addSet(setCode, false); 
        await addCards(setCode);
      }

    } catch (err) {
      console.log(err);
    } finally {
      await client.end(); 
    }
}


/*set:SETNAME+in:booster
  Examples: 
    const URL = 'https://api.scryfall.com/sets/fin';
    const URLTWO = 'https://api.scryfall.com/cards/search?q=set%3Afin%2Bin%3Abooster'; */

//populateSet("FIN", true); 

//if updating setReviews, you must add the bonus sheet cards as well 
updateSetReviews('452951cf-378b-4472-b7fe-572fe2af2ac0');

//call if set has a link
//addBonusLink('EOE', 'EOS');