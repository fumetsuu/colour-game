import React from 'react'
import ReactDOM from 'react-dom'
import Rx from 'rxjs/Rx'
import tinycolor from 'tinycolor2'

export default class SatSlider extends React.Component {
  constructor(props) {
    super(props)
    this.valSlider = null
    this.state = {
        hue: this.props.hue,
        sat: this.props.sat,
        val: this.props.val
    }
  }
  
  render() {
      var gradpoint1 = tinycolor(`hsv(${this.props.hue}, ${this.props.sat}, 0%)`).toHexString()
      var gradpoint2 = tinycolor(`hsv(${this.props.hue}, 100%, 100%)`).toHexString()
    return (   
        <div style={{position: 'relative'}} >
            <div className="val-slider" ref={slider => { this.valSlider = slider }} style={{
                background: `linear-gradient(to right, ${gradpoint1} 0%, ${gradpoint2} 100%)`,
                width: this.props.width+'px',
                height: this.props.height+'px',
                position: 'absolute',
                userFocus: 'none'
            }}>
            <Marker left={this.props.val*this.props.width/100 > this.props.width-4 ? this.props.width-4 : this.props.val*this.props.width/100} height={this.props.height}/> 
            </div>  
        </div>
    );
  }
  
  componentDidMount() {
    let mouseDown = Rx.Observable.fromEvent(this.valSlider, "mousedown")
    mouseDown.subscribe(clickEvent => {
      const val = Math.round(100*(clickEvent.offsetX/this.props.width)) > 100 ? 100 : Math.round(100*(clickEvent.offsetX/this.props.width))
      this.setState({
        val: val
      })
      this.props.onValSlide(val)

    })

    let mouseMoves = Rx.Observable.fromEvent(document.body, "mousemove")
    let mouseUps = Rx.Observable.fromEvent(document.body, "mouseup")

    let mouseDrags = mouseDown.concatMap(clickEvent => {
      const xMouseShouldBe = this.state.val*this.props.width/100
      const xMouseIs = clickEvent.clientX
      const xMouseDelta = xMouseIs - xMouseShouldBe
      return mouseMoves.takeUntil(mouseUps).map(moveEvent => {
        let leftNorm = moveEvent.clientX - xMouseDelta
        if(leftNorm<0) {
          leftNorm = 0
        } else if(leftNorm>this.props.width) {
          leftNorm = this.props.width
        }
        return leftNorm
      })
    })

    mouseDrags.forEach(leftNorm => {
      const val = Math.round(100*(leftNorm/this.props.width))
      this.setState({
        val: val
      })
      this.props.onValSlide(val)
    })

  }
  
}

const Marker = props => {
  return(
    <div style={{
      width: "3px",
      height: props.height,
      border: "1px solid white",
      outline: "1px solid black",
      position: "absolute",
      top: "0",
      left: props.left+"px",
      pointerEvents: "none"
    }}/>
  )
}
