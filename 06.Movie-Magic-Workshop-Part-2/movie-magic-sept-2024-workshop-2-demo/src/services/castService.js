import Cast from "../models/Cast.js";

const getAll = () => Cast.find();

// const getAllWithout = (castIds) => Cast.find({ _id: { $nin: castIds } });
const getAllWithout = (castIds) => Cast.find().nin('_id', castIds); //nin (not in) use if many values (array); if one value, use "ne" (not equal);

const create = (cast) => Cast.create(cast);

export default {
    create,
    getAll,
    getAllWithout,
}
