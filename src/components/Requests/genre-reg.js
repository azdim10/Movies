const genreRequest = () => {
  const _defaultPath = 'https://api.themoviedb.org/3/genre/movie/list'
  const _apiKey = '9045b6c0fe363c6a49809384296b6695'
  const _language = 'en'
  const url = `${_defaultPath}?api_key=${_apiKey}&language=${_language}`
      try {
        return fetch(url).then(res => res.json());
      }
      catch (e) {
        console.log(e)
        alert (`Проверьте интернет соединение ${e}`)
      }
}
export default genreRequest