import mongoose from 'mongoose'

const ussdSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        default: new Date()
    }
})

export const request = mongoose.model('Alert', ussdSchema)

