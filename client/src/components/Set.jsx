function Set({handleClick, set_id, set_code, set_img}) {

    return (
        <button className="setButton" style={{backgroundImage: `url(${set_img})`}}onClick={() => handleClick(set_id)}>
            {set_code.toUpperCase()}
        </button>
    );

}

export default Set;