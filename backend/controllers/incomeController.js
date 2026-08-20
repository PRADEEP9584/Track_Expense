import incomeModel from '../models/incomeModel.js';
import XLSX from 'xlsx';
import getDateRange from '../utils/dateFilter.js';

// Add Income
export async function addIncome(req, res) {
    const userId = req.user._id || req.user.id;
    const { description, amount, category, date } = req.body;

    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields (description, amount, category, date) are required."
            });
        }

        const newIncome = new incomeModel({
            userId,
            description,
            amount: Number(amount),
            category,
            date: new Date(date)
        });
        await newIncome.save();
        res.status(201).json({
            success: true,
            message: "Income added successfully",
            data: newIncome
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Get All Income (with optional range filter)
export async function getAllIncome(req, res) {
    const userId = req.user._id || req.user.id;
    const { range } = req.query;

    try {
        let query = { userId };
        if (range && range !== "all") {
            const { start, end } = getDateRange(range);
            query.date = { $gte: start, $lte: end };
        }
        const incomes = await incomeModel.find(query).sort({ date: -1 });
        res.json({
            success: true,
            data: incomes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Update Income
export async function updateIncome(req, res) {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    const { description, amount, category, date } = req.body;

    try {
        const updateFields = {};
        if (description !== undefined) updateFields.description = description;
        if (amount !== undefined) updateFields.amount = Number(amount);
        if (category !== undefined) updateFields.category = category;
        if (date !== undefined) updateFields.date = new Date(date);

        const updatedIncome = await incomeModel.findOneAndUpdate(
            { _id: id, userId },
            updateFields,
            { new: true }
        );

        if (!updatedIncome) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        res.json({
            success: true,
            message: "Income updated successfully.",
            data: updatedIncome
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Delete Income
export async function deleteIncome(req, res) {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;
    try {
        const income = await incomeModel.findOneAndDelete({ _id: id, userId });
        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income record not found"
            });
        }
        return res.json({
            success: true,
            message: "Income deleted successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Download Excel for Income
export async function downloadIncomeExcel(req, res) {
    const userId = req.user._id || req.user.id;
    try {
        const income = await incomeModel.find({ userId }).sort({ date: -1 });
        const plainData = income.map((inc) => ({
            Description: inc.description,
            Amount: inc.amount,
            Category: inc.category,
            Date: new Date(inc.date).toLocaleDateString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Income");
        
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
        res.setHeader("Content-Disposition", "attachment; filename=income_details.xlsx");
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

// Get Income Overview
export async function getIncomeOverview(req, res) {
    try {
        const userId = req.user._id || req.user.id;
        const { range = "monthly" } = req.query;
        
        let query = { userId };
        let start, end;
        if (range !== "all") {
            const rangeDates = getDateRange(range);
            start = rangeDates.start;
            end = rangeDates.end;
            query.date = { $gte: start, $lte: end };
        }

        const incomes = await incomeModel.find(query).sort({ date: -1 });

        const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
        const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
        const numberOfTransactions = incomes.length;
        const recentTransactions = incomes.slice(0, 9);

        res.json({
            success: true,
            data: {
                totalIncome,
                averageIncome,
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