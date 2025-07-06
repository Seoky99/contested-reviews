function Panel({tempPageNav}) {
    return (
        <div>
            <button onClick={tempPageNav} className="panel-button">EDIT</button>
            <button className="panel-button">DELETE</button>
        </div>
    );
}

export default Panel;