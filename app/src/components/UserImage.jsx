const path = require('path')
import React, { Component } from 'react';
import { connect } from 'react-redux'
const tinycolor = require('tinycolor2')
const Jimp = require('jimp')
const MAX_WIDTH = 950
const MAX_HEIGHT = 500
class UserImage extends Component { 
    constructor(props) {
        super(props)
        this.state = {
            imagePath: this.props.imagePath,
            answer: 'transparent'
        }
        this.totalH = 0
        this.totalS = 0
        this.totalV = 0
        this.avgH = 0
        this.avgS = 0
        this.avgV = 0
        this.pixCount = 0
    }

    componentWillReceiveProps(props) {
        console.log('props')
        if(props.imagePath && props.imagePath != this.props.imagePath ) {
            Jimp.read(props.imagePath, (err, img) => {
                const imgw = img.bitmap.width
                const imgh = img.bitmap.height
                if(imgw <= MAX_WIDTH && imgh <= MAX_HEIGHT) {
                    console.log("smaller")
                } else if(imgw > MAX_WIDTH || imgh > MAX_HEIGHT) {
                    if(imgw/imgh > MAX_WIDTH/MAX_HEIGHT) {
                        img.resize(MAX_WIDTH)
                    } else if(imgw/imgh<=MAX_WIDTH/MAX_HEIGHT) {
                        img.resize(Jimp.AUTO, MAX_HEIGHT)
                    } 
                } 
                this.sampleImage(img)
            })
        }
    }

    render() {
        console.log(this.state.imagePath)
        return (
            <div className="user-image-wrapper">
                <div/>
                <div className="image-wrapper">
                    <img src={this.state.imagePath} className="user-image"/>
                </div>
                <div className="answer-area">
                    <div className="colours-compare">
                        <div className="show-colour" style={{backgroundColor: this.state.answer}}/>
                        <div className="show-colour" style={{backgroundColor: this.state.userColour}}/>
                    </div>
                    <div className="reveal-button" onClick={this.revealAnswer.bind(this)}>Reveal Answer</div>
                </div>
            </div>
        );
    }

    revealAnswer() {
        if(this.state.imagePath) {
            var ans = tinycolor(`hsv(${this.avgH}, ${this.avgS}, ${this.avgV})`).toHexString()
            this.setState({answer: ans, userColour: this.props.userColour})
        }
    }

    sampleImage(img) {
        console.log('from func', img)
        var startX = Math.floor(Math.random()*(img.bitmap.width-this.props.sampleRadius))+this.props.sampleRadius
        var startY = Math.floor(Math.random()*(img.bitmap.height-this.props.sampleRadius))+this.props.sampleRadius
        this.totalH = 0, this.totalS = 0, this.totalV = 0, this.avgH = 0, this.avgS = 0, this.avgV = 0, this.pixCount = 0
        console.log(startX, startY, this.props.sampleRadius, this.props.sampleRadius)
        img.scan(startX, startY, this.props.sampleRadius, this.props.sampleRadius, (x, y, idx) => {
            if(x == startX || x==startX+this.props.sampleRadius-1 || y==startY || y==startY+this.props.sampleRadius-1) {
                img.setPixelColor(0xFF0000FF, x, y)
            } else {
                img.getPixelColor(x, y, (err, hex) => {
                    if(err) throw err
                    if(tinycolor('#'+hex.toString(16)).toHsv().a == 1) {
                        this.totalH += tinycolor('#'+hex.toString(16)).toHsv().h
                        this.totalS += tinycolor('#'+hex.toString(16)).toHsv().s
                        this.totalV += tinycolor('#'+hex.toString(16)).toHsv().v
                        this.pixCount++
                    }
                })
            }
            if(x == startX+this.props.sampleRadius-1 && y == startY+this.props.sampleRadius-1) {
                this.avgH = this.totalH/this.pixCount
                this.avgS = this.totalS/this.pixCount
                this.avgV = this.totalV/this.pixCount
                console.log("done ", this.totalH, this.totalS, this.totalV)
                const rand = Math.floor(Math.random()*88888)
                img.write(path.join(__dirname, "../temp/"+rand+".png"), (err, img) => {
                    this.setState({
                        imagePath: path.join(__dirname, "../temp/"+rand+".png").replace(/\\/g, "/")
                    })
                })
            }
        })
    }
}

const mapStateToProps = state => {
    return {
        imagePath: state.imagePath,
        sampleRadius: state.sampleRadius,
        userColour: state.colour
    }
}

export default connect(mapStateToProps)(UserImage)