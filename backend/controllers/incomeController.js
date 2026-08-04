import incomeModel from '../models/incomeModel.js';

//add income
export async function addIncome(req,res){
    const userId=req.user._id;
    const {description, amount, category, date}=req.body;

    try{
        if(!description || !amount || !category || !date){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }

        const newIncome=new incomeModel({
            userId,
            description,
            amount,
            category,
            date:new Date(date)
        });
        await newIncome.save()
        res.json({
            success:true,
            message:"Income added successfully"
        });
    }
    catch(error){
console.log(error);
res.status(500).json({
    success:false,
    message:"Server Error"
})
    }
}


//to get all income(all)