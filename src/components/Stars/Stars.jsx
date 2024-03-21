import { React, Component } from 'react';
import { Rate } from 'antd'
import './stars.css';
import {postReq} from '../Requests/local-reg.js';

export default class Start extends Component{
    state = {
        starValue : null,
    }
    onStarsChange = (event) => {
        this.setState(
            {
                starValue : event,
            }
        )
    }
    componentDidUpdate(){
        const { id } = this.props;
        const {starValue} = this.state
        if (id && starValue) {
            postReq(id, starValue)
        }
    }
    componentDidMount(){
        const {id, rating} = this.props
        if (rating) {
            this.setState({
                starValue : rating,
            })
        }
        else {
            this.setState({
                starValue: Number(localStorage.getItem(`${id}`))
            })
        }
    }
    render() {
        const {starValue} = this.state
        return <Rate allowHalf count = {10} onChange = {this.onStarsChange} value = {starValue} />
    }
}