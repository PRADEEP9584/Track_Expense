import mongoose from "mongoose";

export const connectDB = async () => {
    const uri = process.env.MONGO_URI || "mongodb://pradeep9ies_db_user:PradeepPatel@ac-4lpd6lg-shard-00-00.olanzuh.mongodb.net:27017,ac-4lpd6lg-shard-00-01.olanzuh.mongodb.net:27017,ac-4lpd6lg-shard-00-02.olanzuh.mongodb.net:27017/?ssl=true&replicaSet=atlas-p7kouj-shard-0&authSource=admin&appName=Cluster0";
    try {
        await mongoose.connect(uri);
        console.log("DB Connected Successfully");
    } catch (err) {
        console.error("DB Connection Error:", err.message);
    }
};
