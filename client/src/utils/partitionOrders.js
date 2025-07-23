const RANK_ORDER = ['S+', 'S', 'S-', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F+', 'F', 'F-', 'NR'];
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

    const COLOR_NAMES_MAP = {
    'W': 'White',
    'U': 'Blue',
    'B': 'Black',
    'R': 'Red',
    'G': 'Green',

    'W,U': 'Azorius',
    'U,B': 'Dimir',
    'B,R': 'Rakdos',
    'R,G': 'Gruul',
    'W,G': 'Selesnya',

    'W,B': 'Orzhov',
    'U,R': 'Izzet',
    'B,G': 'Golgari',
    'W,R': 'Boros',
    'U,G': 'Simic',

    'W,U,B': 'Esper',
    'U,B,R': 'Grixis',
    'B,R,G': 'Jund',
    'W,R,G': 'Naya',
    'W,U,G': 'Bant',

    'W,B,R': 'Mardu',
    'U,R,G': 'Temur',
    'W,B,G': 'Abzan',
    'W,U,R': 'Jeskai',
    'U,B,G': 'Sultai',

    'W,U,B,R': 'Glint',
    'U,B,R,G': 'Dune',
    'W,B,R,G': 'Ink',
    'W,U,R,G': 'Witch',
    'W,U,B,G': 'Yore',

    'W,U,B,R,G': 'Five-Color',

    //Custom color for non-land colorless: debatable if this should be filtered separately 
    'CC': 'Colorless'
};

const WUBRG_ORDER = ['W', 'U', 'B', 'R', 'G'];

const CMC_ORDER=[];
    for (let i = 0; i < 16; i++) {
        CMC_ORDER.push(i);
    }

export default { RANK_ORDER, RARITY_ORDER, WUBRG_ORDER, COLOR_NAMES_ARRAY, COLOR_NAMES_MAP, CMC_ORDER };

