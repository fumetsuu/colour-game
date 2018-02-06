import React, { Component } from 'react'
import Rx from 'rxjs/Rx'

class Hue extends React.Component {
    constructor({onHueChange}) {
      super({onHueChange});
      
      const padding = 100;
      const innerSize = 300;
      this.radius = innerSize/2;
      this.outterSize = innerSize + padding;
      this.centerOffset = this.outterSize/2;
      
      this.state = {
        hue: 0
      }
      
      this.canvas = null;
      this.selector = null;
      this.wheel = null
    }
  
    render() {
      return (
        <svg ref={(canvas) => { this.canvas = canvas; }}
          fill='none'
          strokeWidth={20}
          width={this.outterSize} height={this.outterSize} 
          viewBox={`0 0 ${this.outterSize} ${this.outterSize}`} 
          xmlns="http://www.w3.org/2000/svg" version="1.1">
          <g className="wheel-svg" transform={`translate(${this.centerOffset},${this.centerOffset})`} ref={(wheel) => { this.wheel = wheel; }}>
            {Array.from({length: 360}, (value, key) => (
              <HueSlice 
                degree={key}
                radius={this.radius} 
                color={`hsl(${key}, 100%, 50%)`}/>
            ))}
            <g ref={(selector) => { this.selector = selector; }}>
              <Marker 
                degree={this.state.hue}
                radius={this.radius}/>
            </g>
          </g>
        </svg>
     
      );
    }
    
    componentDidMount() {
      // Event handling using Reactive JS
      let mouseDowns = Rx.Observable.fromEvent(this.wheel, "mousedown");
      let mouseMoves = Rx.Observable.fromEvent(document.body, "mousemove");
      let mouseUps = Rx.Observable.fromEvent(document.body, "mouseup");
      // let mouseLeaves = Rx.Observable.fromEvent(this.canvas, "mouseleave");
      
      mouseDowns.subscribe(clickEvent => {
        const xMouseIs = clickEvent.offsetX
        const yMouseIs = clickEvent.offsetY
        const xRelativeToCenter = this.centerOffset-xMouseIs
        const yRelativeToCenter = this.centerOffset-yMouseIs
        const degree = Math.atan(yRelativeToCenter/xRelativeToCenter)*180/Math.PI - 90 + (xRelativeToCenter>=0 ? 0 : 180);
        this.setState({
          hue: degree
        })
        this.props.onHueChange(degree)
      })

      let mouseDrags = mouseDowns.concatMap(clickEvent => {
        const xMouseShouldBe = Math.sin(this.state.hue/180*Math.PI)*this.radius;
        const yMouseShouldBe = -Math.cos(this.state.hue/180*Math.PI)*this.radius;
        const xMouseIs = clickEvent.clientX;
        const yMouseIs = clickEvent.clientY;
        const xMouseDelta = xMouseIs - xMouseShouldBe;
        const yMouseDelta = yMouseIs - yMouseShouldBe;
        return mouseMoves.takeUntil(mouseUps).map(moveEvent => {
          const xRelativeToCenter = moveEvent.clientX-xMouseDelta;
          const yRelativeToCenter = moveEvent.clientY-yMouseDelta;
          const degree = Math.atan(yRelativeToCenter/xRelativeToCenter)*180/Math.PI + 90 + (xRelativeToCenter>=0 ? 0 : 180);
          return parseInt(degree);
        })
      });
      
      mouseDrags.forEach(degree => {
        this.setState({
          hue: degree
        })
        this.props.onHueChange(degree)
      });
    }
  }
  
  const HueSlice = ({degree, color, radius}) => {
    const thickness = 1
    const startX  =   Math.sin((degree-thickness)/180*Math.PI)*radius;
    const startY  = - Math.cos((degree-thickness)/180*Math.PI)*radius;
    const endX    =   Math.sin((degree+thickness)/180*Math.PI)*radius;
    const endY    = - Math.cos((degree+thickness)/180*Math.PI)*radius;
    return <path 
             className={'hueslice'} 
             d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`} 
             stroke={color} /> 
  }

  const Marker = ({degree, radius}) => {
    const startX  =   Math.sin((degree)/180*Math.PI)*radius;
    const startY  = - Math.cos((degree)/180*Math.PI)*radius;
    return <circle cx={startX} cy={startY} r="8" stroke={degree >= 35 && degree <= 80 ? 'black' : 'white'} strokeWidth="2" fill=""></circle>
  }
  
export default Hue