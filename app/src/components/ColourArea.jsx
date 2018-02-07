const path = require('path')
import React, { Component } from 'react'
import { Map } from 'coloreact'
import Hue from './Hue.jsx'
import HueSlider from './HueSlider.jsx'
const tinycolor = require('tinycolor2')
import { connect } from 'react-redux'

class ColourArea extends Component {
    constructor(props) {
        super(props)
        this.state = {
            h: 0,
            s: 0,
            v: 0,
            hex: "#000000"
        }
    }1
    render() {
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
                    <Hue onHueChange={this.handleHue.bind(this)} hue={this.state.h} className="hue-circle"/>
                    <div className="pseudo-border-hue"/>
                    <div className="pseudo-border-hue2"/>
                </div>
                <div className="colours-sliders">
                    <span className="colour-labels">H: {(this.state.h)}</span> <HueSlider onHueSlide={this.handleHue.bind(this)} hue={this.state.h} className="hue-slider" width={350} height={30}/>
                    <span className="colour-labels">S: {Math.round(this.state.s)}</span> <HueSlider onHueSlide={this.handleHue.bind(this)} hue={this.state.h} className="hue-slider" width={350} height={30}/>
                    <span className="colour-labels">V: {Math.round(this.state.v)}</span> <HueSlider onHueSlide={this.handleHue.bind(this)} hue={this.state.h} className="hue-slider" width={350} height={30}/>
                </div>
                <div className="colour-preview" style={{backgroundColor: this.state.hex}}/>
                <div className="control-buttons">
                        <div className="control-button"><i className="material-icons">attach_file</i></div>
                        <div className="control-button" onClick={this.handleFileUpload.bind(this)}><i className="material-icons">insert_drive_file</i></div>
                </div>
            </div>
        )
    }

    handleHue(h) {
        this.setState({h: h, hex: tinycolor(`hsv(${h}, ${this.state.s}, ${this.state.v})`).toHexString()})
    }

    handleSaturationValue(s, v) {
        this.setState({ s: s, v: v, hex: tinycolor(`hsv(${this.state.h}, ${s}, ${v})`).toHexString()})
    }

    handleFileUpload() {
        require('electron').remote.dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Images', extensions: ['jpg', 'png', 'jpeg'] }
            ]
        }, filepath => {
            this.props.chooseImage(path.normalize(filepath[0]).replace(/\\/g, "/"))
        })
    }
}

const mapDispatchToProps = dispatch => {
    return {
        chooseImage: filepath => dispatch({
            type: "OPEN_IMAGE",
            payload: {
                imagePath: filepath
            }
        })
    }
}

export default connect(null, mapDispatchToProps)(ColourArea)