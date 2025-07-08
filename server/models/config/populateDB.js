import client from '../client.js';
import defaultRatings from '../defaultRatings.js';

//Update the cards as they get spoiled by running addCards(url);

/**
 * Fetches set information or cards for a given URL 
 * @param {string} url - The Scryfall API URL to fetch  
 * @param {boolean} isSet - Fetch the set information on True, cards on False 
 * @returns {Promise<Array>} - Returns the set data as an array for sets, json.data for cards
 */
async function fetchScryfall(url, isSet=false) {
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

      isSet ? data.push([json.id, json.code, json.name]) : data.push(...json.data);

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
 * Adds the set information to the sets table in the database  
 * Note: if you add a bonus set, call addBonusLink
 * TODO: set_img
 * @param {string} url - Scryfall API URL 
 * @param {boolean} isBonus - Whether you are inserting a bonus set 
 */
async function addSet(url, isBonus=false) {
 
  const query = `INSERT INTO sets(set_id, set_code, name, is_bonus) VALUES ($1, $2, $3, $4) ON CONFLICT (set_id) DO NOTHING`;

  const [dataArray] = await fetchScryfall(url, true); 
  dataArray.push(isBonus);

  pushToClient(query, dataArray);
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
  pushToClient(query, dataArray);
}

/**
 * Adds the cards to the cards table in the database
 * @param {string} url - Scryfall API URL  
 */
async function addCards(url) {

  const data = await fetchScryfall(url);
  let query = `INSERT INTO cards(card_id, set_id, cmc, colors, name, image_urls, rarity, type_line, keywords, artist)
                    VALUES`;
  const dataArray = [];
  let count = 0;
  const numColsInserted = 10;

  data.forEach((card, i) => {
    let querySegment = `(`;

    for (let colCount = 0; colCount < numColsInserted; colCount++) {
      count++;
      querySegment += `$${count}${colCount === numColsInserted - 1 ? `` : `, `}`;
    }

    querySegment += `)${i === data.length - 1 ? `` : `,`}`;
    query += querySegment;

    //handling of multi-face cards >:( i hate them 
    //Note: in-booster query makes it so that no-face cards should be removed

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

  pushToClient(query, dataArray);
}

/**
 * Helper to utilize client 
 * @param {string} query - Scryfall API URL
 * @param {*[]} dataArray - SQL Parametrization array (card values)
 */
async function pushToClient(query, dataArray) {
  try {
    await client.connect();
    await client.query(query, dataArray);
  } catch (err) {
    console.log(err);
  } finally {
    await client.end();
  }
}

async function updateSetReviews(set_id) {

  await client.connect(); 
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

    await useClient(matchingQuery, [set_id]);
    await useClient(matchingBonusQuery, [set_id]);
    await useClient(defaultAppliedQuery, [set_id]);
    await useClient(nonRatedQuery, [set_id]);

    await client.end(); 
}

async function useClient(query, dataArray) {
  try {
    await client.query(query, dataArray);
  } catch (err) {
    console.log(err);
  } 
}


/*set:SETNAME+in:booster
  Examples: 
    const URL = 'https://api.scryfall.com/sets/fin';
    const URLTWO = 'https://api.scryfall.com/cards/search?q=set%3Afin%2Bin%3Abooster';

    const URL = 'https://api.scryfall.com/sets/eoe';
    const URLTWO = 'https://api.scryfall.com/cards/search?q=set%3Aeoe%2Bin%3Abooster';

    const URL = 'https://api.scryfall.com/sets/eos';
    const URLTWO = 'https://api.scryfall.com/cards/search?q=set%3Aeos%2Bin%3Abooster';

    const URL = 'https://api.scryfall.com/sets/fca';
    const URLTWO = 'https://api.scryfall.com/cards/search?q=set%3Afca%2Bin%3Abooster';
*/

//const URL = 'https://api.scryfall.com/sets/eos';
//const URLTWO = 'https://api.scryfall.com/cards/search?q=set%3Aeos%2Bin%3Abooster';

//addSet(URL, true);
//addCards(URLTWO);

//if updating setReviews, you must add the bonus sheet cards as well 
//updateSetReviews('452951cf-378b-4472-b7fe-572fe2af2ac0');

//call if set has a link
//addBonusLink('EOE', 'EOS');