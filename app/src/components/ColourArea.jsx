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
        var colsText1 = `H: ${this.state.h}　　S: ${Math.round(this.state.s)}　　V: ${Math.round(this.state.v)}`
        var colsText2 = `R: ${tinycolor(this.state.hex).toRgb().r}　　G: ${tinycolor(this.state.hex).toRgb().g}　　B: ${tinycolor(this.state.hex).toRgb().b}`
        var colsText3 = ` Hex: ${this.state.hex}`
        return (
            <div className="colour-area">
                <div className="colour-area-picker">
                    <Map
                        x={this.state.s}
                        y={this.state.v}
                        backgroundColor={tinycolor(`hsv(${this.state.h}, 100, 100)`).toHexString()}
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
                <div className="colours-text">
                    {colsText1}<br/>
                    {colsText2}<br/>
                    {colsText3}
                </div>
                <div className="colour-preview" style={{backgroundColor: this.state.hex}}/>
            </div>
        )
    }

    handleHue(h) {
        this.setState({h: h, hex: tinycolor(`hsv(${h}, ${this.state.s}, ${this.state.v})`).toHexString()})
    }

    handleSaturationValue(s, v) {
        console.log(s,v)
        this.setState({ s: s, v: v, hex: tinycolor(`hsv(${this.state.h}, ${this.state.s}, ${this.state.v})`).toHexString()})
    }
}
