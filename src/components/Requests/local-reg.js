const _apiKey = '9045b6c0fe363c6a49809384296b6695';
const _defaultUrl = 'https://api.themoviedb.org/3/';
const postReq = (id, starValue) => {
    const header = {
        value: starValue,
    }
    localStorage.setItem(id, `${starValue}`)
    let _url = `${_defaultUrl}movie/${id}/rating?api_key=${_apiKey}&guest_session_id=${localStorage.getItem('guest')}`
    try {
        return fetch(_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(header),
        }).then((res) => res.json())
    }
    catch (e) {
        console.log('Ошибка POST запроса' + e)
        alert (`Проверьте интернет соединение ${e}`)
    }
}
const getSessionReg = () => {
    let _url = `${_defaultUrl}authentication/guest_session/new?api_key=${_apiKey}`;
    try {
        return fetch(_url).then((res) => res.json())
    }
    catch (e) {
        console.log('Ошибка запроса ID гостевой сессии' + e)
        alert (`Проверьте интернет соединение ${e}`)
    }
}
const getReq = () =>{
    let _url = `${_defaultUrl}guest_session/${localStorage.getItem(
        'guest'
      )}/rated/movies?api_key=${_apiKey}&language=ru-RU&sort_by=created_at.asc`
    try {
        return fetch(_url).then((res) => res.json())
    }
    catch (e){
        console.log('Ошибка GET запроса' + e)
        alert (`Проверьте интернет соединение ${e}`)
    }
}
export {postReq, getSessionReg, getReq}