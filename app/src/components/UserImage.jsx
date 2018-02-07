const path = require('path')
import React, { Component } from 'react';
import { connect } from 'react-redux'
const tinycolor = require('tinycolor2')
const Jimp = require('jimp')
class UserImage extends Component { 
    constructor(props) {
        super(props)
        this.state = {
            startX: 0,
            startY: 0,
            imagePath: this.props.imagePath
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
        console.log(props)
        if(props.imagePath) {
            Jimp.read(props.imagePath, (err, img) => {
                var startX = Math.floor(Math.random()*(img.bitmap.width-10))+10
                var startY = Math.floor(Math.random()*(img.bitmap.height-10))+10
                this.setState({
                    startX: 100*startX/img.bitmap.width,
                    startY: 100*startY/img.bitmap.height
                })
                this.totalH = 0, this.totalS = 0, this.totalV = 0, this.avgH = 0, this.avgS = 0, this.avgV = 0, this.pixCount = 0
                console.log(startX, startY, props.sampleRadius, props.sampleRadius)
                img.scan(startX, startY, props.sampleRadius, props.sampleRadius, (x, y, idx) => {
                    if(x == startX || x==startX+props.sampleRadius-1 || y==startY || y==startY+props.sampleRadius-1) {
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
                    if(x == startX+props.sampleRadius-1 && y == startY+props.sampleRadius-1) {
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
                <div className="reveal-button" onClick={this.revealAnswer.bind(this)}>Reveal Answer</div>
            </div>
        );
    }

    revealAnswer() {
        console.log(`hsv(${this.avgH}, ${this.avgS}, ${this.avgV})`)
    }
}

const mapStateToProps = state => {
    return {
        imagePath: state.imagePath,
        sampleRadius: state.sampleRadius
    }
}

export default connect(mapStateToProps)(UserImage)