import client from '../client.js';

/**
 * Initializes the tables in the database 
 * Bonus / List are in Sets, joined by table bonus_link
 */
async function initSchema() {
  const query = `SELECT * FROM users;`;

  try {
    await client.connect();
    const {rows} = await client.query(query);
    console.log(rows);
  } catch (err) {
    console.log(err);
  } finally {
    await client.end();
  }
}

initSchema();
