import React, { Component } from 'react'
import Rx from 'rxjs/Rx'

class Hue extends React.Component {
    constructor({onHueChange}) {
      super({onHueChange});
      
      const padding = 20;
      const innerSize = 300;
      this.radius = innerSize/2;
      this.outterSize = innerSize + padding;
      this.centerOffset = this.outterSize/2;
      
      this.state = {
        dragging: false,
        hue: 0
      }
      
      this.canvas = null;
      this.selector = null;
    }
  
    render() {
      return (
        <svg ref={(canvas) => { this.canvas = canvas; }}
          fill='none'
          strokeWidth='20px'
          width={this.outterSize} height={this.outterSize} 
          viewBox={`0 0 ${this.outterSize} ${this.outterSize}`} 
          xmlns="http://www.w3.org/2000/svg" version="1.1">
          <g transform={`translate(${this.centerOffset},${this.centerOffset})`}>
            {Array.from({length: 360}, (value, key) => (
              <HueSlice 
                degree={key}
                radius={this.radius} 
                color={`hsl(${key}, 100%, 50%)`}
                marker={false} />
            ))}
            <g ref={(selector) => { this.selector = selector; }}>
              <HueSlice 
                degree={this.state.hue}
                radius={this.radius}
                color={this.state.dragging ? `hsl(${this.state.hue}, 100%, 50%)` : "white"}
                marker={true}/>
            </g>
          </g>
        </svg>
     
      );
    }
    
    componentDidMount() {
      // Event handling using Reactive JS
      let mouseDowns = Rx.Observable.fromEvent(this.canvas, "mousedown");
      let mouseMoves = Rx.Observable.fromEvent(this.canvas, "mousemove");
      let mouseUps = Rx.Observable.fromEvent(this.canvas, "mouseup");
      let mouseLeaves = Rx.Observable.fromEvent(this.canvas, "mouseleave");
      
      let mouseDrags = mouseDowns.concatMap(clickEvent => {
        const xMouseShouldBe = Math.sin(this.state.hue/180*Math.PI)*this.radius;
        const yMouseShouldBe = -Math.cos(this.state.hue/180*Math.PI)*this.radius;
        const xMouseIs = clickEvent.clientX;
        const yMouseIs = clickEvent.clientY;
        const xMouseDelta = xMouseIs - xMouseShouldBe;
        const yMouseDelta = yMouseIs - yMouseShouldBe;
        return mouseMoves.takeUntil(mouseUps.merge(mouseLeaves)).map(moveEvent => {
          const xRelativeToCenter = moveEvent.clientX-xMouseDelta;
          const yRelativeToCenter = moveEvent.clientY-yMouseDelta;
          const degree = Math.atan(yRelativeToCenter/xRelativeToCenter)*180/Math.PI + 90 + (xRelativeToCenter>=0 ? 0 : 180);
          return parseInt(degree);
        })
      });
      
      let dragStarts = mouseDowns
      let drags = mouseDrags
      let dragEnds = mouseUps.merge(mouseLeaves)
      
      dragStarts.forEach(() => {
        this.setState({dragging: true});
      });
      
      drags.forEach(degree => {
        this.setState({
          hue: degree
        })
        this.props.onHueChange(degree)
      });
      
      dragEnds.forEach(() => {
        this.setState({dragging: false});
      });
    }
  }
  
  const HueSlice = ({degree, color, radius, marker}) => {
    const thickness = marker ? 5 : 1;
    const startX  =   Math.sin((degree-thickness)/180*Math.PI)*radius;
    const startY  = - Math.cos((degree-thickness)/180*Math.PI)*radius;
    const endX    =   Math.sin((degree+thickness)/180*Math.PI)*radius;
    const endY    = - Math.cos((degree+thickness)/180*Math.PI)*radius;
    return <path 
             className={marker && 'marker'} 
             d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`} 
             stroke={color} /> 
  }
  
export default Hue