import React from 'react'
import ReactDOM from 'react-dom'
import Rx from 'rxjs/Rx'
import tinycolor from 'tinycolor2'

export default class SatSlider extends React.Component {
  constructor(props) {
    super(props)
    this.satslider = null
    this.state = {
        hue: this.props.hue,
        sat: this.props.sat,
        val: this.props.val
    }
  }
  
  render() {
      var gradpoint1 = tinycolor(`hsv(${this.props.hue}, 0, ${this.props.val}%)`).toHexString()
      var gradpoint2 = tinycolor(`hsv(${this.props.hue}, 100%, ${this.props.val}%)`).toHexString()
    return (   
        <div style={{position: 'relative'}} >
            <div className="sat-slider" ref={slider => { this.satslider = slider }} style={{
                background: `linear-gradient(to right, ${gradpoint1} 0%, ${gradpoint2} 100%)`,
                width: this.props.width+'px',
                height: this.props.height+'px',
                position: 'absolute',
                userFocus: 'none'
            }}>
            <Marker left={this.props.sat*this.props.width/100 > this.props.width-4 ? this.props.width-4 : this.props.sat*this.props.width/100} height={this.props.height}/> 
            </div>  
        </div>
    );
  }
  
  componentDidMount() {
    let mouseDown = Rx.Observable.fromEvent(this.satslider, "mousedown")
    mouseDown.subscribe(clickEvent => {
      const sat = Math.round(100*(clickEvent.offsetX/this.props.width)) > 100 ? 100 : Math.round(100*(clickEvent.offsetX/this.props.width))
      this.setState({
        sat: sat
      })
      this.props.onSatSlide(sat)

    })

    let mouseMoves = Rx.Observable.fromEvent(document.body, "mousemove")
    let mouseUps = Rx.Observable.fromEvent(document.body, "mouseup")

    let mouseDrags = mouseDown.concatMap(clickEvent => {
      const xMouseShouldBe = this.state.sat*this.props.width/100
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
      const sat = Math.round(100*(leftNorm/this.props.width))
      this.setState({
        sat: sat
      })
      this.props.onSatSlide(sat)
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
