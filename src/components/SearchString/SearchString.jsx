import React , {Component} from 'react';
import { debounce } from 'lodash'
import './searchstring.css'


export default class SearchString extends Component {
onLabelChange = (event) =>{
    if (event.target.value.charAt(0)===' '){
        return ''
    }
    this.debounceSearch(event.target.value)
}
  debounceSearch = debounce((value) => {
    this.props.searchMovie(value)
  }, 500)
  render() {
    return (
        <form className='input'>
          <label className='search_label'>
            <input 
            type = 'text'
            className= 'search_input'
            plaseholder ='Input to search'
            onChange ={this.onLabelChange}
            />
            </label>
        </form>
    )
  }
}