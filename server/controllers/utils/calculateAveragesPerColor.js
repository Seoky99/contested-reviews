import ratingsNumericMap from "./ratingsNumericMap.js";

export function calculateAveragesPerColor(rows) {
    const colorMap = new Map(); 

    rows.forEach( row => {

        let colorKey = ""; 

        if (row.colors.length < 1) {
            if (row.types.includes("Land")) {
                colorKey = "L"; 
            } else {
                colorKey = "C"; 
            }
        } else {
            colorKey = row.colors.join(",");
        }

        colorKey += ` - ${row.rarity}`; 

        if (!colorMap.has(colorKey)) {
            colorMap.set(colorKey, []);
        }

        if (row.rank) {
            if (row.rank != 'NR') {
                colorMap.get(colorKey).push(ratingsNumericMap[row.rank]);
            }
        }
    })

    const raw = Array.from(colorMap);

    const averages = {};

    for (const [color, scores] of raw) {
        let sum = 0;
        for (let i = 0; i < scores.length; i++) {
            sum += scores[i];
        }
        averages[color] = scores.length > 0 ? sum / scores.length : null;
    }

    return averages; 
}