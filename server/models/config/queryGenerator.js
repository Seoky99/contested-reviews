/**
 * Generates a query ($1, $2, .... $colCount), ($colCount + 1...) for each card  
 * @param {*} initialQuery 
 * @param {*} numTuplesInserted 
 * @param {*} numColsInserted 
 * @returns 
 */
export default function (initialQuery, numTuplesInserted, numColsInserted, offset=0, intCast=false) {
    let count = offset; 

    for (let i = 0; i < numTuplesInserted; i++) {
        let querySegment = `(`;

        for (let colCount = 0; colCount < numColsInserted; colCount++) {
        count++;
        querySegment += `$${count}${intCast ? `::int` : ``}${colCount === numColsInserted - 1 ? `` : `, `}`;
        }

        querySegment += `)${i === numTuplesInserted - 1 ? `` : `,`}`;
        initialQuery += querySegment; 
    };

    return initialQuery; 
}