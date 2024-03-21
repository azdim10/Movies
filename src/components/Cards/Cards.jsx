import  React, { Component } from 'react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

import  Genres  from '../Genres/Genres.jsx';
import Stars  from '../Stars/Stars.jsx';
import './Cards.css'
import Image from '../../resources/poster-holder.jpg' 
export default class Cards extends Component {
    _imgUrl = 'https://image.tmdb.org/t/p/w500';
    state = {
        isVisibleText: false,
        isVisibleDot: true,
    }
    overviewText = (text) => text.split(' ').slice(0, 34).join(' ');
    overviewMoreText = (text) => {
        let words = text.split(' ');
        if (words.length > 35) return words.slice(34, words.length).join(' ');
    }
    hiddenDot = (text) => {
        let words = text.split(' ')
        return words.length > 35 ? '...' : ' '
    }
    showMore = () => {
        this.setState(({ isVisibleText, isVisibleDot }) => ({
            isVisibleText: !isVisibleText,
            isVisibleDot: !isVisibleDot,
        }));
    };
    posterPath = (poster_Path, availPoster) => (poster_Path === null ? Image : availPoster)
    dateRelease = (release_date) => {
        if(release_date){
            return format(new Date (release_date), 'PP', {locale : enUS})
        }
        return 'Release date unknown'
    }
    rateColor = (vote_average) => {
        if(vote_average <=3){
            return {borderColor: '#E90000'}
        }
        if (vote_average <=5) {
            return {borderColor: '#E97E00'}
        }
        if (vote_average <=7) {
            return {borderColor : '#E9D100'}
        }
        return {borderColor: '#66E900'}
    }
    render(){
        const {id, poster_path, title, release_date, vote_average, overview, genre_ids, rating} = this.props;
        const {isVisibleText, isVisibleDot} = this.state;
        let dots = !isVisibleDot ? 'dots': '';
        let availPoster = `${this._imgUrl}${poster_path}`;
        return (
            <section className = 'result'>
                <div className = 'result_item'>
                    <img className = 'result_img' src ={this.posterPath(poster_path, availPoster)} alt = 'poster'></img>
                    <div className = 'result_info'>
                        <h2 className ='result_title'>{title}</h2>
                        <div className = 'vote_average' style = {this.rateColor(vote_average)}>
                        <span>{vote_average.toFixed(1)}</span>
                        </div>
                        <div className = 'result_date'>{this.dateRelease(release_date)}</div>
                        <div className ='result_genres'>
                        <Genres genre_ids ={genre_ids} key ={id} />
                        </div>
                        <p className="intro" onClick={this.showMore}>
                            {isVisibleText ? this.overviewMoreText(overview) : this.overviewText(overview)}
                            <span className={dots}>{this.hiddenDot(overview)}</span>
                        </p>
                        <Stars id={id} rating={rating}/>
                    </div>
                </div>
            </section>
        )
    }
}