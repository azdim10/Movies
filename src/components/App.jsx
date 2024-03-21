import React, { Component } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { Tabs, Alert, Space, Pagination } from 'antd'

import apiRequest from './Requests/api-reg.js'
import genreRequest from './Requests/genre-reg.js'
import { getSessionReg, getReq } from './Requests/local-reg.js'
import { Provider } from './Consumer/Consumer.js'

import SearchString from './SearchString/SearchString.jsx'
import Preload from './Preload/Preload.jsx'

import './App.css'
const Movies = React.lazy(() => import('./Films/Films'))

export default class App extends Component {
  state = {
    movies: [],
    ratedMovies: [],
    genresMovies: [],
    value: '',
    totalPage: null,
    currentPage: 1,
    isLoading : false,
  }

  componentDidMount() {
    genreRequest().then((genresMovies) => this.setState({ genresMovies: genresMovies.genres }))
    getSessionReg().then((guestSession) => {
      !localStorage.getItem('guest') && localStorage.setItem('guest', `${guestSession.guest_session_id}`)
    })
  }

  onChangeTabs = () => {
    getReq().then((dataRate) => {
      this.setState({
        ratedMovies: dataRate.results,
      })
    })
  }

  searchMovie = (inputText) => {
    if (inputText) {
      this.setState({ isLoading: true}, () =>{
      apiRequest(inputText).then((data) => {
        this.setState({
          value: inputText,
          movies: data.results,
          totalPage: data.total_pages,
          currentPage: data.page,
          isLoading: false,
        });
      });
    });
    }
    else {
      this.setState({
        value:'',
        movies:[],
        totalPage: null,
        currentPage:1,
        isLoading: false,
      })
    }
  };

  nextPage = (valuePagination) => {
    this.setState({ isLoading: true}, () => {
    apiRequest(this.state.value, valuePagination).then((data) => {
      this.setState({
        movies: data.results,
        totalPage: data.total_pages,
        currentPage: data.page,
        isLoading:false
      })
    })
  })
  }

  render() {
    const { movies, ratedMovies, genresMovies, currentPage, totalPage } = this.state

    return (
      <Tabs
        centered
        defaultActiveKey="1"
        onChange={this.onChangeTabs}
        items={[
          {
            label: 'Search',
            key: '1',
            children: (
              <>
                <Online>
                  <Provider value={genresMovies}>
                    <div className="movies-app">
                      <SearchString searchMovie={this.searchMovie}/>
                      <React.Suspense fallback={<Preload />}>
                        <Movies movies={movies} />
                      </React.Suspense>
                      <Pagination
                        current={currentPage}
                        onChange={this.nextPage}
                        total={totalPage * 20}
                        hideOnSinglePage={true}
                        pageSize={20}
                        showSizeChanger={false}
                      />
                    </div>
                  </Provider>
                </Online>
                <Offline>
                  <Space
                    direction="vertical"
                    style={{
                      width: '100%',
                    }}
                  >
                    <Alert
                      message="Внимание!"
                      description="Отсутствует подключение к интернету."
                      type="error"
                      showIcon
                    />
                  </Space>
                </Offline>
              </>
            ),
          },
          {
            label: 'Rated',
            key: '2',
            children: (
              <Provider value={genresMovies}>
                <div className="movies-app">
                  <React.Suspense fallback={<Preload />}>
                    <Movies movies={ratedMovies} />
                  </React.Suspense>
                </div>
              </Provider>
            ),
          },
        ]}
      />
    )
  }
}