import styles from "./Mechanisms.module.css";

function Mechanisms({partition, sort, filter, setParams}) {

    return (<>
                <div className={styles.mechanism}>
                    <label htmlFor="filtering">Filter: </label>
                    <select name="fitering" id="filtering" value={filter}  onChange={(e) => { setParams('filter', e.target.value)}}>
                        <option default value="none">None</option>
                        <option value="white">By White</option>
                        <option value="blue">By Blue</option>
                        <option value="black">By Black</option>
                        <option value="red">By Red</option>
                        <option value="green">By Green</option>
                        <option value="multicolor">By Multicolor</option>
                        <option value="hasTag">Has Tag</option>
                        <option value="mainset">From Main Set</option>
                        <option value="bonus">From Bonus</option>
                        <option disabled>Advanced Filters</option>
                    </select>
                </div>
                
                <div className={styles.mechanism}>
                    <label htmlFor="partition">Partition:</label>
                    <select name="partition" id="sorting" value={partition} onChange={(e) => {
                        setParams('partition', e.target.value)}}>
                        <option default value="none">None</option>
                        <option value="color">By Color</option>
                        <option value="cmc">By CMC</option>
                        <option value="rank">By Rating</option>
                        <option value="rarity">By Rarity</option>
                    </select>
                </div>

                <div className={styles.mechanism}>
                    <label htmlFor="sorting">Sort: </label>
                    <select name="sorting" id="sorting" value={sort} onChange={(e) => { setParams('sort', e.target.value)}}>
                        <option default value="none">None</option>
                        <option value="color">By Color</option>
                        <option value="cmc">By CMC</option>
                        <option value="rank">By Rating</option>
                        <option value="rarity">By Rarity</option>
                        <option value="CN">By CN</option>
                    </select>
                </div>
            
            </>
    );
}

export default Mechanisms;