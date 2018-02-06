import React, { Component } from 'react'
import { Map } from 'coloreact'
import Hue from './Hue.jsx'
const tinycolor = require('tinycolor2')

export default class ColourArea extends Component {
    constructor(props) {
        super(props)
        this.state = {
            h: 355,
            s: 0,
            v: 0,
            hex: "#ff0000"
        }
    }
    render() {
        return (
            <div className="colour-area">
                <Map
                    x={this.state.s}
                    y={this.state.v}
                    backgroundColor={this.state.hex}
                    max={100}
                    onChange={this.handleSaturationValue.bind(this)}
                    className="sat-val-map"
                    pointerStyle={{
                        color: (this.state.s > 50 || this.state.v < 70) ? 'white' : 'black'
                    }}
                />
                <Hue onHueChange={this.handleHue.bind(this)} className="hue-circle"/>
                <div className="pseudo-border-hue"/>
                <div className="pseudo-border-hue2"/>
                
            </div>
        )
    }

    handleHue(h) {
        this.setState({h: h, hex: tinycolor(`hsl(${h}, 100%, 50%)`).toHexString()})
    }

    handleSaturationValue(s, v) {
        console.log(s,v)
        this.setState({ s: s, v: v})
    }
}
