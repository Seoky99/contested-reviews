const SUPERTYPES = [
  "Basic",
  "Legendary",
  "Snow",
  "World",
  "Ongoing",
  "Elite"
];

/**
 * Parses a Magic type line string into supertypes, types, and subtypes.
 *
 * @param {string} typeLine - e.g. "Legendary Creature — Angel"
 * @returns {object} { supertypes: [], types: [], subtypes: [] }
 */
function parseTypeLine(typeLine) {
  const result = {
    supertypes: [],
    types: [],
    subtypes: []
  };

  // Split on em dash (—) to separate subtypes
  const [leftPart, rightPart] = typeLine.split("—").map(part => part && part.trim());

  if (!leftPart) {
    throw new Error("Invalid type line: " + typeLine);
  }

  // Split left part into words
  const tokens = leftPart.split(/\s+/);

  // Separate supertypes and types
  for (const token of tokens) {
    if (SUPERTYPES.includes(token)) {
      result.supertypes.push(token);
    } else {
      result.types.push(token);
    }
  }

  // If there's a right part, split into subtypes
  if (rightPart) {
    result.subtypes = rightPart.split(/\s+/);
  }

  return result;
}

export default parseTypeLine; 