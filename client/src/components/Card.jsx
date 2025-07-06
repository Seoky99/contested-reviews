function Card({cardData}) {
    return (
        <div className="card">
            <button className="card-button" style={{backgroundImage: `url(${cardData.image_urls[0]})`}}></button>
            <h1>{cardData.rank}</h1>
        </div>
    )
}

export default Card; 