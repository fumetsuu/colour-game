import React from 'react'

export default function reducer(state = { imagePath: null }, action) {
    switch(action.type) {
        case "OPEN_IMAGE": {
            return Object.assign({}, state, {
                imagePath: action.payload.imagePath
            })
        }
        default: return state
    }
}