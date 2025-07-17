const RANK_ORDER = ['S', 'A', 'B', 'C', 'D', 'F', 'NR'];
const RARITY_ORDER = ['common', 'uncommon', 'rare', 'mythic']; 
const COLOR_NAMES_ARRAY = [
    'White',
    'Blue',
    'Black',
    'Red',
    'Green',
    'Azorius',
    'Dimir',
    'Rakdos',
    'Gruul',
    'Selesnya',
    'Orzhov',
    'Izzet',
    'Golgari',
    'Boros',
    'Simic',
    'Esper',
    'Grixis',
    'Jund',
    'Naya',
    'Bant',
    'Mardu',
    'Temur',
    'Abzan',
    'Jeskai',
    'Sultai',
    'Glint',
    'Dune',
    'Ink',
    'Witch',
    'Yore',
    'Five-Color', 
    //Consider colorless nonland as a color?
    'Colorless'
];

 export const COLOR_NAMES_MAP = {
    'W': 'White',
    'U': 'Blue',
    'B': 'Black',
    'R': 'Red',
    'G': 'Green',

    'W,U': 'Azorius',
    'U,B': 'Dimir',
    'B,R': 'Rakdos',
    'R,G': 'Gruul',
    'G,W': 'Selesnya',

    'W,B': 'Orzhov',
    'U,R': 'Izzet',
    'B,G': 'Golgari',
    'R,W': 'Boros',
    'G,U': 'Simic',

    'W,U,B': 'Esper',
    'U,B,R': 'Grixis',
    'B,R,G': 'Jund',
    'R,G,W': 'Naya',
    'G,W,U': 'Bant',

    'W,B,R': 'Mardu',
    'U,R,G': 'Temur',
    'B,G,W': 'Abzan',
    'R,W,U': 'Jeskai',
    'G,U,B': 'Sultai',

    'W,U,B,R': 'Glint',
    'U,B,R,G': 'Dune',
    'B,R,G,W': 'Ink',
    'R,G,W,U': 'Witch',
    'G,W,U,B': 'Yore',

    'W,U,B,R,G': 'Five-Color',

    //Custom color for non-land colorless: debatable if this should be filtered separately 
    'CC': 'Colorless'
};

const CMC_ORDER=[];
    for (let i = 0; i < 16; i++) {
        CMC_ORDER.push(i);
    }

export default { RANK_ORDER, RARITY_ORDER, COLOR_NAMES_ARRAY, COLOR_NAMES_MAP, CMC_ORDER };

