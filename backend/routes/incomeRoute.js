import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import {addIncome, deleteIncome, downloadIncomeExcel, getAllIncome, getIncomeOverview, updateIncome}

const incomeRouter=express.Router();

incomeRouter.post("/add", authMiddleware, addIncome);
incomeRouter.get("/get",authMiddleware, getAllIncome);

incomeRouter.put("/update/:id", authMiddleware, updateIncome);
incomeRouter.get("/downloadExcel", authMiddleware, downloadIncomeExcel);

incomeRouter.delete("/delete/:id", authMiddleware, deleteIncome);
incomeRouter.get("/overview", authMiddleware, getIncomeOverview);

export default incomeRouter;
