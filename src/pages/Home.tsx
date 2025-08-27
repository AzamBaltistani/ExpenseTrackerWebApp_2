import AreaChartHome from "@/components/home_charts/AreaChartHome";
import { BarChartStackedBySource } from "@/components/home_charts/BarChartStackedBySource";
import { ChartPieIncomeExpense } from "@/components/home_charts/ChartPieIncomeExpense";
import { RadarChartBySource } from "@/components/home_charts/RadarChartBySource";
import { useEffect, useState } from "react";

const LOCAL_STORAGE_EXPENSES = "expenses";
const LOCAL_STORAGE_CURRENCY = "selected_currency";
const LOCAL_STORAGE_INCOMES = "incomes";

export interface Expense {
    id: number;
    source: string;
    amount: number;
    date: string;
}

export interface Income {
    id: number;
    source: string;
    amount: number;
    date: string;
}

interface MergedData {
    date: string;
    income: number;
    expense: number;
}

const Home = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [mergedData, setMergedData] = useState<MergedData[]>([]);
    const [currency, setCurrency] = useState<{ code: string; symbol: string }>({
        code: "USD",
        symbol: "$",
    });

    const mergeIncomeExpenseByDate = (
        incomes: Income[],
        expenses: Expense[]
    ): MergedData[] => {
        const incomeMap = incomes.reduce((acc, curr) => {
            acc[curr.date] = (acc[curr.date] || 0) + curr.amount;
            return acc;
        }, {} as Record<string, number>);

        const expenseMap = expenses.reduce((acc, curr) => {
            acc[curr.date] = (acc[curr.date] || 0) + curr.amount;
            return acc;
        }, {} as Record<string, number>);

        const allDates = Array.from(
            new Set([...Object.keys(incomeMap), ...Object.keys(expenseMap)])
        ).sort();

        return allDates.map((date) => ({
            date,
            income: incomeMap[date] || 0,
            expense: expenseMap[date] || 0,
        }));
    };

    useEffect(() => {
        const savedCurrency = localStorage.getItem(LOCAL_STORAGE_CURRENCY);
        if (savedCurrency) {
            try {
                const parsed = JSON.parse(savedCurrency);
                if (parsed.code && parsed.symbol) {
                    setCurrency(parsed);
                }
            } catch {
                // handle later
            }
        }

        const savedExpenses = localStorage.getItem(LOCAL_STORAGE_EXPENSES);
        const savedIncomes = localStorage.getItem(LOCAL_STORAGE_INCOMES);

        let parsedExpenses: Expense[] = [];
        let parsedIncomes: Income[] = [];

        if (savedExpenses) {
            try {
                const parsed = JSON.parse(savedExpenses);
                if (Array.isArray(parsed)) {
                    setExpenses(parsed);
                    parsedExpenses = parsed;
                }
            } catch {
                // ignore 
            }
        }

        if (savedIncomes) {
            try {
                const parsed = JSON.parse(savedIncomes);
                if (Array.isArray(parsed)) {
                    setIncomes(parsed);
                    parsedIncomes = parsed;
                }
            } catch {
                // handle later
            }
        }

        const merged = mergeIncomeExpenseByDate(parsedIncomes, parsedExpenses);
        setMergedData(merged);

    }, []);

    return (
        <div className="flex w-full h-[93vh]">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-2 p-2">
                <div className="md:col-span-2 lg:col-span-3 w-full ">
                    <AreaChartHome chartData={mergedData} currency={currency} />
                </div>
                <div className="h-full">
                    <BarChartStackedBySource
                        incomes={incomes}
                        expenses={expenses}
                        currency={currency}
                    />
                </div>
                <div className="">
                    <RadarChartBySource currency={currency} expenses={expenses} incomes={incomes} />
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                    <ChartPieIncomeExpense incomes={incomes} expenses={expenses} currency={currency} />
                </div>
            </div>
        </div>
    );
};

export default Home;
