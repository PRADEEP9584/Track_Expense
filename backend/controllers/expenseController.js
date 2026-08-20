import expenseModel from '../models/expenseModel.js';
import getDateRange from '../utils/dateFilter.js';
import XLSX from 'xlsx';

// Add Expense
export async function addExpense(req, res) {
    const userId = req.user._id || req.user.id;
    const { description, amount, category, date } = req.body;

    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields (description, amount, category, date) are required"
            });
        }
        const newExpense = new expenseModel({
            userId,
            description,
            amount: Number(amount),
            category,
            date: new Date(date)
        });
        await newExpense.save();
        res.status(201).json({
            success: true,
            message: "Expense added successfully",
            data: newExpense
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Get All Expense (with optional range filter)
export async function getAllExpense(req, res) {
    const userId = req.user._id || req.user.id;
    const { range } = req.query;

    try {
        let query = { userId };
        if (range && range !== "all") {
            const { start, end } = getDateRange(range);
            query.date = { $gte: start, $lte: end };
        }
        const expenses = await expenseModel.find(query).sort({ date: -1 });
        res.json({
            success: true,
            data: expenses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Update Expense
export async function updateExpense(req, res) {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    const { description, amount, category, date } = req.body;

    try {
        const updateFields = {};
        if (description !== undefined) updateFields.description = description;
        if (amount !== undefined) updateFields.amount = Number(amount);
        if (category !== undefined) updateFields.category = category;
        if (date !== undefined) updateFields.date = new Date(date);

        const updatedExpense = await expenseModel.findOneAndUpdate(
            { _id: id, userId },
            updateFields,
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        res.json({
            success: true,
            message: "Expense updated successfully.",
            data: updatedExpense
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Delete Expense
export async function deleteExpense(req, res) {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;
    try {
        const expense = await expenseModel.findOneAndDelete({ _id: id, userId });
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }
        return res.json({
            success: true,
            message: "Expense deleted successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Download Excel for Expense
export async function downloadExpenseExcel(req, res) {
    const userId = req.user._id || req.user.id;
    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
        const plainData = expenses.map((exp) => ({
            Description: exp.description,
            Amount: exp.amount,
            Category: exp.category,
            Date: new Date(exp.date).toLocaleDateString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expense");

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
        res.setHeader("Content-Disposition", "attachment; filename=expense_details.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error generating Excel file"
        });
    }
}

// Get Expense Overview
export async function getExpenseOverview(req, res) {
    try {
        const userId = req.user._id || req.user.id;
        const { range = "monthly" } = req.query;

        let query = { userId };
        if (range !== "all") {
            const { start, end } = getDateRange(range);
            query.date = { $gte: start, $lte: end };
        }

        const expenses = await expenseModel.find(query).sort({ date: -1 });

        const totalExpense = expenses.reduce((acc, cur) => acc + cur.amount, 0);
        const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;
        const numberOfTransactions = expenses.length;
        const recentTransactions = expenses.slice(0, 9);

        res.json({
            success: true,
            data: {
                totalExpense,
                averageExpense,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}
