import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import React from 'react';
import Card from './Card';
import useArticlesContext from "../hooks/use-articles-context";

import "../styles/ArticleFeed.css"

const GET_ARTICLES = gql`
  query GetArticles($offset: Int, $limit: Int) {
    articles(offset: $offset, limit: $limit){
      id
      title
      author {
        name
      }
      createdAt
      team {
        id
      }
      league {
        id
      }
      imageUrlString
    }
  }
`;

const PAGE_SIZE = 8;

export default function ArticleFeed({onClickArticle}) {
  const { page, increasePage, decreasePage, articleIdArray } = useArticlesContext();

  const { data, loading } = useQuery(GET_ARTICLES, {
    variables: {
      offset: page * PAGE_SIZE,
      limit: PAGE_SIZE,
    },
  });

  let content
  if (data && articleIdArray) content = data.articles
    .filter(article => (
      articleIdArray.length === 0
        ? true
        : articleIdArray.includes(article.team.id) || articleIdArray.includes(article.league.id) // this line of code nearly killed me
    ))

    .map(article => (
      <Card
        key={article.id}
        id={article.id} 
        img={article.imageUrlString}
        title={article.title}
        author={article.author.name}
        createdAt={article.createdAt}
        onClickArticle={onClickArticle}
      />
    ))

  if (data) console.log('data.articles.length', data.articles.length)
  console.log('articleIdArray', articleIdArray)
  return (
    <div className="ArticleFeed">
      <div className='ArticleFeed-articles'>
        {loading ? (
          <p>Loading</p>
        ) : (
          <div>
            <nav className='ArticleFeed-navigation'>
              <button disabled={!page} onClick={decreasePage}>Previous</button>
              <span>Page {page + 1}</span>
              <button disabled={content.length < PAGE_SIZE} onClick={increasePage}>Next</button>
            </nav>
              <div className='Card-container'>
                {content}
              </div>
            </div>
        )}
      </div>
    </div>
  );
}
