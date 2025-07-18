 
 export default function(rows) {

    const cardMap = new Map();

    for (const row of rows) {
        if (!cardMap.has(row.card_id)) {
            cardMap.set(row.card_id, {
                cardId: row.card_id,
                cmc: row.cmc,
                collectorNumber: row.collector_number,
                rarity: row.rarity,
                layout: row.layout,
                userSetId: row.user_set_id,
                setId: row.set_id,
                reviewId: row.review_id,
                notes: row.notes, 
                rank: row.rank,
                faces: []
            });
        }

        cardMap.get(row.card_id).faces.push({
            faceIndex: row.face_index,
            name: row.name,
            manaCost: row.mana_cost,
            supertypes: row.supertypes,
            types: row.types,
            subtypes: row.subtypes,
            imageNormal: row.image_normal,
            borderCrop: row.border_crop,
            colors: row.colors 
        });
    }

    return Array.from(cardMap.values());
}