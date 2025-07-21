import client from '../client.js';

/**
 * Initializes the tables in the database 
 * Bonus / List are in Sets, joined by table bonus_link
 */
async function initSchema() {
  const query = `CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            username TEXT UNIQUE NOT NULL, 
            email TEXT UNIQUE NOT NULL, 
            password TEXT NOT NULL 
        );

        CREATE TABLE IF NOT EXISTS sets (
            set_id UUID PRIMARY KEY, 
            set_code TEXT NOT NULL,
            name TEXT NOT NULL,
            is_bonus BOOLEAN DEFAULT FALSE NOT NULL, 
            set_img TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS bonus_links (
            link_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
            main_set_id UUID, 
            bonus_set_id UUID, 
            FOREIGN KEY (main_set_id) REFERENCES sets(set_id), 
            FOREIGN KEY (bonus_set_id) REFERENCES sets(set_id)
        );

        CREATE TABLE IF NOT EXISTS cards (
            card_id UUID PRIMARY KEY,
            set_id UUID NOT NULL,  
            rarity TEXT NOT NULL, 
            cmc INTEGER NOT NULL,
            keywords TEXT[],
            type_line TEXT NOT NULL, 
            layout TEXT NOT NULL,
            digital BOOLEAN,
            collector_number TEXT NOT NULL, 
            FOREIGN KEY (set_id) REFERENCES sets(set_id)
        );

        CREATE TABLE IF NOT EXISTS faces (
            face_id INTEGER GENERATED ALWAYS AS IDENTITY, 
            card_id UUID NOT NULL,
            face_index INTEGER NOT NULL, 
            colors TEXT[],
            image_small TEXT, 
            image_normal TEXT,
            image_large TEXT, 
            image_crop TEXT, 
            border_crop TEXT,
            name TEXT NOT NULL,
            mana_cost TEXT, 
            artist TEXT, 
            power TEXT, 
            toughness TEXT, 
            type_line TEXT,
            supertypes TEXT[],
            types TEXT[],
            subtypes TEXT[],
            PRIMARY KEY (card_id, face_index),
            FOREIGN KEY (card_id) REFERENCES cards(card_id) 
        );

        CREATE TABLE IF NOT EXISTS user_sets(
            user_set_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            user_id INTEGER, 
            set_id UUID,
            name TEXT NOT NULL,
            user_set_img TEXT,
            default_applied BOOLEAN DEFAULT FALSE,
            includes_bonus BOOLEAN DEFAULT FALSE,
            add_spoilers BOOLEAN DEFAULT TRUE,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (set_id) REFERENCES sets(set_id)
        );

        CREATE TABLE IF NOT EXISTS reviews(
            review_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
            user_set_id INTEGER,
            card_id UUID,
            rank TEXT, 
            notes TEXT,
            FOREIGN KEY (user_set_id) REFERENCES user_sets(user_set_id) ON DELETE CASCADE,
            FOREIGN KEY (card_id) REFERENCES cards(card_id),
            UNIQUE (user_set_id, card_id)
        );
        
        CREATE TABLE IF NOT EXISTS tags(
            tag_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            user_id INTEGER,
            user_set_id INTEGER,
            name TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (user_set_id) REFERENCES user_sets(user_set_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS review_tags(
            review_id INTEGER,
            tag_id INTEGER,
            FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE,
            PRIMARY KEY (review_id, tag_id)
        );
        
        CREATE TABLE IF NOT EXISTS trophies(
            trophy_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
            user_set_id INTEGER, 
            review_id INTEGER, 
            name TEXT NOT NULL, 
            description TEXT, 
            trophy_img_url TEXT,
            is_global BOOLEAN DEFAULT FALSE NOT NULL,
            FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON DELETE SET NULL,
            FOREIGN KEY (user_set_id) REFERENCES user_sets(user_set_id) ON DELETE CASCADE
        );
        `;

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
