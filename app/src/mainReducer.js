import React from 'react'

export default function reducer(state = { imagePath: null }, action) {
    switch(action.type) {
        case "OPEN_IMAGE": {
            return Object.assign({}, state, {
                imagePath: action.payload.imagePath,
                sampleRadius: action.payload.sampleRadius
            })
        }
        case "ASK_COLOUR": {
            return Object.assign({}, state, {
                giveColour: true
            })
        }
        case "GIVE_COLOUR": {
            console.log(action.payload.colour)
            return Object.assign({}, state, {
                colour: action.payload.colour
            })
        }
        default: return state
    }
}