import React, { Component } from 'react';
import Alert from '../Alert/Alert.jsx';
import Cards from '../Cards/Cards.jsx';

export default class Movies extends Component {
    render() {
        
      const { movies } = this.props
      if (movies.length) {
        const films = movies.map((film) => {
          const { id, ...allProps } = film
          return <Cards key={id} id={id} {...allProps} />
        })
        return <section className="card-condainer">{films}</section>
      }
      return <Alert />
    }
  }