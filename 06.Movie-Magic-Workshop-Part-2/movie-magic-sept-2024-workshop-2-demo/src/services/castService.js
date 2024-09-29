<<<<<<< HEAD
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
=======
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
>>>>>>> 13d65fba2a04001160fc8a98cfff0fd202dbffaa
