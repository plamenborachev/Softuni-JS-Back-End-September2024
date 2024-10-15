import Volcano from '../models/Volcano.js';

const getAll = (filter = {}) => {
    let volcanoesQuery = Volcano.find();

    // if (filter.search) {
    //     volcanoesQuery.find({ title: { $regex: filter.search, $options: 'i' } });
    //     // moviesQuery.regex('title', new RegExp(filter.search, 'i'))
    // }

    // if (filter.genre) {
    //     volcanoesQuery.find({ genre: filter.genre.toLowerCase() });
    //     // moviesQuery.where('genre').equals(filter.genre.toLowerCase())
    // }

    // if (filter.year) {
    //     volcanoesQuery.find({ year: filter.year });
    //     // moviesQuery.where('year').equals(filter.year);
    // }

    return volcanoesQuery;
};

const create = (volcano, ownerId) => Volcano.create({ ...volcano, owner: ownerId });

const getOne = (volcanoId) => Volcano.findById(volcanoId).populate('voteList.votes');

const remove = (volcanoId) => Volcano.findByIdAndDelete(volcanoId);

const edit = (volcanoId, data) => Volcano.findByIdAndUpdate(volcanoId, data);

export default {
    getAll,
    create,
    getOne,
    // attach,
    remove,
    edit,
}