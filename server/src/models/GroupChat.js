import mongoose, { Schema } from 'mongoose'
import GroupChatMessages from './GroupChatMessages'
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
        ref: 'profile',
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'profile',
        required: true
    }],
    membersCanAdd: {
        type: Boolean,
        default: false,
    }
})
GroupChatSchema.statics.getProfileChats = function (profileId, cb) {
    return this.find({
        $or: [
            { owner: profileId },
            { members: { "$in": [profileId] } }
        ]
    }, cb)
}
GroupChatSchema.virtual.getMessages = function (cb) {
    return GroupChatMessages.find({groupChatId:this._id}).exec(cb)
}
var GroupChat = mongoose.model('groupChats', GroupChatSchema)
module.exports = GroupChat