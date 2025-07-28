import { useState, useEffect } from "react"; 
import styles from "./CardFlow.module.css";
import HomePageData from "./HomePageData";

function CardFlow() {

    const pickRandomIndex = (data) => Math.floor(Math.random() * data.length);

    const [ cardIndex, setCardIndex ] = useState(() => pickRandomIndex(HomePageData));

    let { imgSrc, description, id } = HomePageData[cardIndex]
    const rank = 'A+';
    imgSrc = `/cardflow/${imgSrc}`;

    useEffect(() => {
        const interval = setInterval(() => {
            setCardIndex((prevIndex) => (prevIndex + 1) % HomePageData.length);
        }, 10000);

        return () => clearInterval(interval); 
    }, []);


    return (
        <div className={styles.cardWrapper} key={id}>
            <div className={styles.card}>            
                <img className={styles.image} src={imgSrc}></img>
                <h1 src={styles.rank}>{rank}</h1>
            </div>
            <p>{description}</p>
        </div>
    )

}

export default CardFlow;