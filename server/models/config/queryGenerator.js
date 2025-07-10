
/**
 * If using, remember to call ON CONFLICT 
 * @param {*} initialQuery 
 * @param {*} dataLength 
 * @param {*} numColsInserted 
 * @returns 
 */
export default function (initialQuery, dataLength, numColsInserted) {

    let count = 0; 

    //Generates a query VALUES($1, $2, .... $colCount), ($colCount + 1...) for each card  
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