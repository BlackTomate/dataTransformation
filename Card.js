import React from "react"
import "../styles/Card.css"

function Card({img, title, author, createdAt, id, onClickArticle}) {
    const dateString = new Date(createdAt).toString().slice(4,15);

    const handleClick = () => onClickArticle(id)

        return (
        <div key={id} className='Card' onClick={handleClick}>
            <div className='Card-image'>
                <img alt={title} className='Card-image' src={img}/>
            </div>
            <div className='Card-content'>
                <div className='Card-title'>
                    <h3>{title}</h3>
                </div>
                <div className='Card-body'>
                    <h5>By: {author}</h5>
                    <span>Published: {dateString}</span>
                </div>
            </div>

        </div>
    )
}

export default Card
