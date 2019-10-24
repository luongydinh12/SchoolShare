import mongoose, { Schema } from 'mongoose'

const GroupChatSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }],
    membersCanAdd: {
        type: Boolean,
        default: false,
    }
})

var GroupChat = mongoose.model('groupChats', GroupChatSchema)
module.exports = GroupChat