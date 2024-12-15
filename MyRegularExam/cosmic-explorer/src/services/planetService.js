import Planet from "../models/Planets.js";

const getAll = (filter = {}) => {
    let planetsQuery = Planet.find();

    if (filter.name) {
        planetsQuery.find({ name: { $regex: filter.name, $options: 'i' } });
    }

    if (filter.solarSystem) {
        planetsQuery.find({ solarSystem: { $regex: filter.solarSystem, $options: 'i' } });
    }

    return planetsQuery;
};

const create = (planet, ownerId) => Planet.create({ ...planet, owner: ownerId });

const getOne = (planetId) => Planet.findById(planetId).populate('likedList');

const like = (planetId, userId) => {
    return Planet.findByIdAndUpdate(planetId, { $push: { likedList: userId } });
};

const remove = (planetId) => Planet.findByIdAndDelete(planetId);

const edit = (planetId, data) => Planet.findByIdAndUpdate(planetId, data, {runValidators: true});

export default {
    getAll,
    create,
    getOne,
    like,
    remove,
    edit,
}