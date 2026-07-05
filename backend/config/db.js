import mongoose from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://pradeep9ies_db_user:aPwQMVTc7mxLyIcB@cluster0.r89apua.mongodb.net/Expense")
    .then(()=>console.log("DB Connected"));

}