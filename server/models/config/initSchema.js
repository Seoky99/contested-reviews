import client from '../client.js';

/**
 * Initializes the tables in the database 
 */
async function initSchema() {
  const query = `CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            username TEXT UNIQUE NOT NULL, 
            email TEXT UNIQUE NOT NULL, 
            password TEXT NOT NULL 
        );

        CREATE TABLE sets (
            set_id UUID PRIMARY KEY, 
            set_code TEXT NOT NULL,
            name TEXT NOT NULL,
            set_img TEXT NOT NULL 
        );

        CREATE TABLE cards (
            card_id UUID PRIMARY KEY, 
            set_id UUID,
            cmc INTEGER, 
            colors TEXT[],
            name TEXT,
            image_urls TEXT[], 
            rarity TEXT,
            type_line TEXT, 
            keywords TEXT[],
            artist TEXT, 
            FOREIGN KEY (set_id) REFERENCES sets(set_id)
        );

        CREATE TABLE user_sets(
            user_set_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            user_id INTEGER, 
            set_id UUID,
            name TEXT NOT NULL,
            user_set_img TEXT,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (set_id) REFERENCES sets(set_id)
        );

        CREATE TABLE reviews(
            review_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
            user_set_id INTEGER,
            card_id UUID,
            rank TEXT, 
            notes TEXT,
            FOREIGN KEY (user_set_id) REFERENCES user_sets(user_set_id) ON DELETE CASCADE,
            FOREIGN KEY (card_id) REFERENCES cards(card_id)
        );
        
        CREATE TABLE tags(
            tag_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            user_id INTEGER,
            set_id UUID,
            name TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (set_id) REFERENCES sets(set_id)
        );

        CREATE TABLE review_tags(
            review_id INTEGER,
            tag_id INTEGER,
            FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE,
            PRIMARY KEY (review_id, tag_id)
        );`;

  try {
    await client.connect();
    await client.query(query);
  } catch (err) {
    console.log(err);
  } finally {
    await client.end();
  }
}

initSchema();
