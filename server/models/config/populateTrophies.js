import client from '../client.js';
import queryGenerator from './queryGenerator.js';

//user_id, name, description, img_url
const trophyData = [
    [null, "Best White Common", null, null],
    [null, "Best Blue Common", null, null],
    [null, "Best Black Common", null, null],
    [null, "Best Red Common", null, null],
    [null, "Best Green Common", null, null],
    [null, "Best White Uncommon", null, null],
    [null, "Best Blue Uncommon", null, null],
    [null, "Best Black Uncommon", null, null],
    [null, "Best Red Uncommon", null, null],
    [null, "Best Green Uncommon", null, null],
    [null, "Best Common", null, null],
    [null, "Best Uncommon", null, null],
    [null, "Best Rare", null, null],
    [null, "Best Mythic", null, null],
    [null, "Best Build-Around", null, null],
    [null, "Best Signpost Uncommon", null, null],
    [null, "Best Art", null, null],
    [null, "Biggest Noob Trap", null, null],
    [null, "Worst Card In The Set", null, null],
    [null, "Biggest Bomb", null, null],
    [null, "Most Important Glue For Its Archetype", null, null], 
    [null, "Coolest Design", null, null]
];


async function populateTrophies() {
    try {

        await client.connect();

        const initialQuery = `INSERT INTO trophies(user_id, name, description, trophy_img_url) VALUES `;
        let query = queryGenerator(initialQuery, trophyData.length, 4);
        query += ` ON CONFLICT DO NOTHING`; 

        const dataArray = []; 
        trophyData.forEach(trophy => dataArray.push(...trophy));

        await client.query(query, dataArray);

    } catch (err) {
        console.log(err); 
    } finally {
        await client.end(); 
    }
}

populateTrophies();
