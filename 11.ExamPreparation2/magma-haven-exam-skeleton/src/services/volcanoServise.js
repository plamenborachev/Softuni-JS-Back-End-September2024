import Volcano from '../models/Volcano.js';

const getAll = (filter = {}) => {
    let volcanoesQuery = Volcano.find();

    if (filter.name) {
        volcanoesQuery.find({ name: { $regex: filter.name, $options: 'i' } });
        // moviesQuery.regex('title', new RegExp(filter.name, 'i'))
    }

    if (filter.typeVolcano) {
        volcanoesQuery.find({ typeVolcano: filter.typeVolcano });
        // moviesQuery.where('genre').equals(filter.genre.toLowerCase())
    }

    // if (filter.year) {
    //     volcanoesQuery.find({ year: filter.year });
    //     // moviesQuery.where('year').equals(filter.year);
    // }

    return volcanoesQuery;
};

const create = (volcano, ownerId) => Volcano.create({ ...volcano, owner: ownerId });

const getOne = (volcanoId) => Volcano.findById(volcanoId).populate('voteList.vote');

const remove = (volcanoId) => Volcano.findByIdAndDelete(volcanoId);

const edit = (volcanoId, data) => Volcano.findByIdAndUpdate(volcanoId, data, {runValidators: true});

const vote = (volcanoId, userId) => {
    // const movie = await Movie.findById(movieId);
    // movie.casts.push(castId);
    // return movie.save();

    return Volcano.findByIdAndUpdate(volcanoId, { $push: { voteList: { vote: userId } } });
};

 export default {
    getAll,
    create,
    getOne,
    vote,
    remove,
    edit,
}