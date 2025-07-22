import partitionOrders from '../../../client/src/utils/partitionOrders.js';

export default function sanitizeColors(cardFace) {
  const { WUBRG_ORDER, COLOR_NAMES_MAP } = partitionOrders;
        const sanitizeColors = Array.isArray(cardFace.colors) ? cardFace.colors : [];
        let colorsSorted = [...sanitizeColors].sort((a, b) => WUBRG_ORDER.indexOf(a) - WUBRG_ORDER.indexOf(b)); 
        let colorName = colorsSorted.join(","); 
        colorName = COLOR_NAMES_MAP[colorName] || 'Colorless';
  return { colorsSorted, colorName };
}