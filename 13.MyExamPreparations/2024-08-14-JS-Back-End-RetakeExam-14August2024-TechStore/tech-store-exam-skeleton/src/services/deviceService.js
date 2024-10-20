import Device from '../models/Device.js'

const getAll = () => Device.find();

const getTopThree = () => Device.find().sort({createdAt: -1}).limit(3);

const getDevicesCreatedByUser = (ownerId) => Device.find({owner: ownerId});

const getDevicesPreferredByUser = (userId) => Device.find({ preferredList: userId});

const create = (device, ownerId) => Device.create({ ...device, owner: ownerId });

const getOne = (deviceId) => Device.findById(deviceId).populate('preferredList');

const prefer = (deviceId, userId) => {
    // const movie = await Movie.findById(movieId);
    // movie.casts.push(castId);
    // return movie.save();
    return Device.findByIdAndUpdate(deviceId, { $push: { preferredList: userId } });
};

const remove = (deviceId) => Device.findByIdAndDelete(deviceId);

const edit = (deviceId, data) => Device.findByIdAndUpdate(deviceId, data, {runValidators: true});

export default {
    getAll,
    getTopThree,
    getDevicesCreatedByUser,
    getDevicesPreferredByUser,
    create,
    getOne,
    prefer,
    remove,
    edit,
}