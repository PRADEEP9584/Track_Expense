import mongoose from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect("mongodb://pradeep9ies_db_user:PradeepPatel@ac-4lpd6lg-shard-00-00.olanzuh.mongodb.net:27017,ac-4lpd6lg-shard-00-01.olanzuh.mongodb.net:27017,ac-4lpd6lg-shard-00-02.olanzuh.mongodb.net:27017/?ssl=true&replicaSet=atlas-p7kouj-shard-0&authSource=admin&appName=Cluster0")
    .then(()=>console.log("DB Connected"));
    
}
// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://pradeep9ies_db_user:PradeepPatel@cluster0.olanzuh.mongodb.net/Expense"
//     );

//     console.log("DB Connected");
//   } catch (err) {
//     console.error("FULL ERROR:");
//     console.error(err);
//   }
// };

