
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI");
}

declare global {
    var mongooseCache: {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
    } | undefined;
}

export const dbConnect = async (): Promise<Mongoose> => {
    const cached = global.mongooseCache || {
        conn: null,
        promise: null,
    };

    global.mongooseCache = cached;

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
