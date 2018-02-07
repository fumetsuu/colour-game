import React, { Component } from 'react';
import { connect } from 'react-redux'
class UserImage extends Component { 
    render() {
        console.log(this.props.imagePath)
        return (
            <div className="user-image-wrapper">
                <div/>
                <div style={{backgroundImage: `url('${this.props.imagePath}')`}} className="user-image"/>
                <div className="reveal-button">Reveal Answer</div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log(state)
    return {
        imagePath: state.imagePath
    }
}

export default connect(mapStateToProps)(UserImage)