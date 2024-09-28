import { connect } from "mongoose";

const dbUrl = 'mongodb://localhost:27017';

export default async function mongooseInit() {
    try {
        const url = process.env.DB_URL || dbUrl;
        await connect(url, { dbName: 'magic-movies' }); //{ dbName: 'magic-movies' }
        console.log('Successfully connected to DB => ' + url);
    } catch (err) {
        console.log('Cannot connect to DB!' + err.message);
    }
}
