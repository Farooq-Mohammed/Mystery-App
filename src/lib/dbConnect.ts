import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

export const connectDB: () => Promise<void> = async () => {
    try {
        if(connection.isConnected) {
            console.log("Already connected to DB");
            return;
        }
        const db = await mongoose.connect(process.env.MONGO_DB_URI || "", {})
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to DB!!");
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
}

export default connectDB;