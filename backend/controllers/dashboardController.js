import incomeModel from '../models/incomeModel.js';
import expenseModel from '../models/expenseModel.js';
import getDateRange from '../utils/dateFilter.js';

export async function getDashboardData(req, res) {
    try {
        const userId = req.user._id || req.user.id;
        const { range = "monthly" } = req.query;

        let dateQuery = {};
        if (range !== "all") {
            const { start, end } = getDateRange(range);
            dateQuery = { $gte: start, $lte: end };
        }

        const incomeQuery = { userId };
        const expenseQuery = { userId };

        if (Object.keys(dateQuery).length > 0) {
            incomeQuery.date = dateQuery;
            expenseQuery.date = dateQuery;
        }

        const [incomes, expenses] = await Promise.all([
            incomeModel.find(incomeQuery).sort({ date: -1 }),
            expenseModel.find(expenseQuery).sort({ date: -1 })
        ]);

        const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
        const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
        const totalBalance = totalIncome - totalExpense;
        const savings = Math.max(0, totalBalance);

        // Category breakdown for expenses
        const categoryMap = {};
        expenses.forEach(item => {
            categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
        });
        const categoryData = Object.keys(categoryMap).map(category => ({
            name: category,
            value: categoryMap[category]
        }));

        // Recent combined transactions
        const formattedIncomes = incomes.map(i => ({ ...i.toObject(), type: 'income' }));
        const formattedExpenses = expenses.map(e => ({ ...e.toObject(), type: 'expense' }));

        const combinedTransactions = [...formattedIncomes, ...formattedExpenses]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        res.json({
            success: true,
            data: {
                totalBalance,
                totalIncome,
                totalExpense,
                savings,
                recentTransactions: combinedTransactions,
                categoryData,
                range
            }
        });
    } catch (error) {
        console.error("Dashboard overview error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error fetching dashboard data"
        });
    }
}
