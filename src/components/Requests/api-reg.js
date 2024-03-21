const apiRequest = (movie, page = 1) => {
  const defaultPath = 'https://api.themoviedb.org/3/search/movie'
  const apiKey = '9045b6c0fe363c6a49809384296b6695'
  const language = 'en'
  const url = `${defaultPath}?api_key=${apiKey}&language=${language}&query=${movie}&page=${page}`
  try {
    return fetch(url).then((response) => response.json())
  } catch (error) {
    console.log(error)
    alert(`Проверте интернет соединение ${error}`)
  }
}

export default apiRequest