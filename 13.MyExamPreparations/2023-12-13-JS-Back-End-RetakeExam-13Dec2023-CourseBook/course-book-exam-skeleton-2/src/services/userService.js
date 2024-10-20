import User from '../models/User.js'

const owner = (userId) => User.findById(userId);

export default {
    owner,
}