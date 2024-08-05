import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import React from "react";
import "../styles/Article.css"

const GET_ARTICLE = gql`
    query ($articleId: ID!){
            article(id: $articleId) {
            title
            imageUrlString
            body
            createdAt
            author {
                name
            }
        }
    }
`;

function Article({id, onClick}) {
    const { data, loading } = useQuery(GET_ARTICLE, {
        variables: { articleId: id },
      });
    
    return <div>
        {loading ? (
            <p>Loading</p>
        ) : data && (
            <div className='Article' onClick={onClick}>
                <div>
                    <img alt={data.article.title} className='Article' src={data.article.imageUrlString}/>
                </div>
                <h1 className='Article'>{data.article.title}</h1>
                <div>
                    <span className='Article'>{data.article.author.name}</span>
                </div>
                <p className='Article'>{data.article.body}</p>
            </div>
        )}
    </div>
}

export default Article