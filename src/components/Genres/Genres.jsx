import React, { Component } from 'react';
import { Consumer } from '../Consumer/Consumer.js';
import './genres.css'

export default class Genres extends Component {
    render () {
        const { genre_ids } = this.props;
        return (
            <Consumer>
                {(category) => {
                    if ( category.length ){
                        let res = genre_ids.map((item) => {
                            let results = category.filter((obj) => obj.id === item )
                            return results.length > 0 ? results[0].name : 'Unknown Genre';
                        })
                        let resultsGen = res.map((genres, id) => {
                            return (
                                <li className = 'genre_item' key = {id}>{genres}</li>
                            )
                        })
                        return resultsGen
                    }
                }}
            </Consumer>
        )
    }
}