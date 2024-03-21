import React, { Component } from 'react';
import { Input, Spin, Rate, Pagination, Tabs } from 'antd';
import fetch from 'isomorphic-fetch';
import debounce from 'lodash/debounce';
import { intlFormat } from 'date-fns';
import './input.css'
const cutText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  let cutedText = text.slice(0, maxLength);
  if (cutedText.charAt(maxLength - 1 ) !== ' '){
    cutedText = cutedText.substr(0, cutedText.lastIndexOf(' '));
  }
  return cutedText + '...';
};
const items = [
  {
    key: '1',
    label: 'Search',
    // children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Rated',
    // children: 'Content of Tab Pane 2',
  },
];

const SearchResults = ({ results}) => (
  <div className="result">
    {results.map(item => {
     const handleRate = () => {
        localStorage.setItem('ratedMovie', JSON.stringify(item, item.vote_average));
     }
      const genres = item.genre_names.filter(genre => genre.length <= 6 && genre !== 'Comedy');
      let color;
      if (item.vote_average !== undefined) {
        if (item.vote_average >= 7) {
          color = '#66E900';
        } else if (item.vote_average >= 5) {
          color = '#E9D100';
        } else if (item.vote_average >= 3) {
          color = '#E97E00';
        } else {
          color = '#E90000';
        }
      } else {
        color = '#000000';
      }

      return (
        <div className="result_item" key={item.id}>
          {item.poster_path && <img className="result_img" src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt='poster' />}
          <div>
            <h2 className="result_title">{item.title}</h2>
            <p className="result_date">{Date.parse(item.release_date) ? intlFormat(new Date(item.release_date), {
              year: 'numeric', month: 'long', day: 'numeric'
            }, { locale: 'en-En' }) : 'Release date not available'}</p>
            {genres.map((genre, index) => (
            <svg key={index} className="genre_frame" width="46" height="20" viewBox="0 0 46 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect className = 'genre_frame_id'x="0.5" y="0.5" width="45" height="19" rx="1.5" fill="#FAFAFA" stroke="#D9D9D9" strokeLinejoin="round"/>
              <text x='5' y='14' fontSize='12' fill='#333'>{genre}</text>
            </svg>
          ))}
            <p className="result_overview">{cutText(item.overview, 205)}</p>
            <h2 className="result_rate"><Rate allowHalf count={10} defaultValue={0} onChange = {handleRate}/></h2>
            <svg className="result_circle" width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="17" cy="17" r="16" stroke={color} strokeWidth="2" />
            </svg>
            <p className="result_average">{item.vote_average !== undefined ? item.vote_average.toFixed(1) : 'Vote average not available'}</p>
          </div>
        </div>
      );
    })}
  </div>
);
class App extends Component {
  state = {
    searchResults: [],
    activeKey : '1',
    value: '',
    isLoading: false,
    currentPage: 1,
    totalPages: 0,
    genres: [],
    isPosterLoad : {}
  };
  
  componentDidMount() {
    this.fetchGenres();
    this.buttonWrap();
  }

  fetchGenres = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MDQ1YjZjMGZlMzYzYzZhNDk4MDkzODQyOTZiNjY5NSIsInN1YiI6IjY1ZWVkNTZmMDAxYmJkMDE4NjdmYTEwZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HVsjyRnra_v3fOFjZpWdqlu385tUgWR2jMJ_Ln89PFE'
      }
    };
    const url = `https://api.themoviedb.org/3/genre/movie/list?language=en`;

    try {
      const response = await fetch(url, options);
      const json = await response.json();
      const genres = json.genres;
      this.setState({ genres });
    } catch (error) {
      console.log('error', error);
    }
  };

  handleSearch = debounce(async (value, page = 1) => {
    if (!value) {
      this.setState({ searchResults: [], isLoading: false, totalPages: 0 });
      return;
    }

    this.setState({ isLoading: true, currentPage: page });

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MDQ1YjZjMGZlMzYzYzZhNDk4MDkzODQyOTZiNjY5NSIsInN1YiI6IjY1ZWVkNTZmMDAxYmJkMDE4NjdmYTEwZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HVsjyRnra_v3fOFjZpWdqlu385tUgWR2jMJ_Ln89PFE'
      }
    };
    const url = `https://api.themoviedb.org/3/search/movie?query=${value}&include_adult=true&language=en-US&page=${page}`;

    try {
      const response = await fetch(url, options);
      const json = await response.json();
      const results = json.results.map(item => {
        this.setState(prevState => ({
          isPosterLoad: {
            ...prevState.isPosterLoad,
            [item.id]: true,
          },
        }));
        const genreNames = item.genre_ids.map(id => {
          const genre = this.state.genres.find(genre => genre.id === id);
          return genre ? genre.name : '';
        });
        return { ...item, genre_names: genreNames };
      });

      this.setState({ searchResults: results, isLoading: false, totalPages: json.total_pages });
    } catch (error) {
      console.log('error', error);
      this.setState({ isLoading: false });
    }
  }, 500);

  onChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
    this.handleSearch(value, 1);
  };

  onPageChange = (page) => {
    this.handleSearch(this.state.value, page);
  };
  componentDidUpdate(prevProps, prevState){
    if (prevState.activeKey !== this.state.activeKey && this.state.activeKey !== '2') {
      this.buttonWrap()
  }
}
    buttonWrap = () => {
    const ratedMovies = JSON.parse(localStorage.getItem('ratedMovie'))
    this.setState({ratedMovies});
    console.log(ratedMovies);
  }
  render() {
    const { value, searchResults, isLoading, currentPage, totalPages } = this.state;
    return (
      <div>
        <Tabs defaultActiveKey ='1' items = {items} onChange = {this.buttonWrap}/>
        <Input
          size="large"
          placeholder="Введите запрос"
          value={value}
          onChange={this.onChange}
        />
        {isLoading ? (
          <div className = 'spiner'>
            <Spin size="large" />
          </div>
        ) : (
          <SearchResults results={searchResults} />
        )}
        <Pagination
          defaultCurrent={currentPage}
          total={totalPages}
          onChange={this.onPageChange}
          hideOnSinglePage
        />
      </div>
    );
  }
}

export default App;