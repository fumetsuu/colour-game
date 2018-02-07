import React, { Component } from 'react';
import { render } from 'react-dom';
import ColourArea from './components/ColourArea.jsx'
import UserImage from './components/UserImage.jsx'
require("./styles/main.sass");
export default class App extends Component {
    render() {
        return(
            <div className="wrapper">
                <UserImage/>
                <ColourArea/>
            </div>
        );
    }
}