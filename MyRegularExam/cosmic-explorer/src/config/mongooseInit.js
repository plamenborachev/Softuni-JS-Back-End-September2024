import { connect } from "mongoose";
import { DB_CONNECTION_STRING, DB_NAME } from "./constants.js";

export default async function mongooseInit() {
    try {
        await connect(DB_CONNECTION_STRING, { dbName: DB_NAME });
        console.log('Successfully connected to DB!');
    } catch (err) {
        console.log('Cannot connect to DB!' + err.message);
    }
}