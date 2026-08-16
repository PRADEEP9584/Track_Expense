import expenseaModel from '../models/expenseModel.js';
import getDateRange from '../utils/getDateRange.js';

//add expense
export async function addExpense(req, res){
    const userId=req.user._id;
    const {description, amount, category, date}=req.body;

    try{
        if(!description || !amount || !category || !date){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }
        const newExpense=new expenseModel({
            userId,
            description,
            amount,
            category,
            date:new Date(date)
        });
        await newExpense.save()
        res.json({
            success:true,
            message:"Expense added successfully"
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

//to get all expense
export async function getAllExpense(req,res){
    const userId=req.user._id;
    
        try{
            const expense=await expenseModel.find({userId}).sort({date:-1});
            res.json(expense);
        }
        catch(error){
    console.log(error);
    res.status(500).json({
        success:false,
        message:"Server Error"
    })
        }
}


//to update the expense
