
/**
 * Generates a query ($1, $2, .... $colCount), ($colCount + 1...) for each card  
 * @param {*} initialQuery 
 * @param {*} dataLength 
 * @param {*} numColsInserted 
 * @returns 
 */
export default function (initialQuery, dataLength, numColsInserted, offset=0) {

    let count = offset; 

    for (let i = 0; i < dataLength; i++) {
        let querySegment = `(`;

        for (let colCount = 0; colCount < numColsInserted; colCount++) {
        count++;
        querySegment += `$${count}${colCount === numColsInserted - 1 ? `` : `, `}`;
        }

        querySegment += `)${i === dataLength - 1 ? `` : `,`}`;
        initialQuery += querySegment; 
    };

    return initialQuery; 
}