import { useEffect, useState } from "react";
import { Plus, Sparkles, Trash } from "lucide-react";
import { ExpenseChart } from "@/components/expense_components/ExpenseChart";
import { ExpenseTable } from "@/components/expense_components/ExpenseTable";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export interface Expense {
    id: number;
    source: string;
    amount: number;
    date: string;
}

const LOCAL_STORAGE_EXPENSES = "expenses";
const LOCAL_STORAGE_CURRENCY = "selected_currency";

const currencyOptions = [
    { code: "PKR", symbol: "Rs" },
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
];

const toSentenceCase = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

export default function Expenses() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [currency, setCurrency] = useState<{ code: string; symbol: string }>({
        code: "USD",
        symbol: "$",
    });

    const [newExpense, setNewExpense] = useState({
        source: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
    });

    const [randomConfig, setRandomConfig] = useState({
        days: 7,
        sources: 3,
    });

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
        if (savedExpenses) {
            try {
                const parsed = JSON.parse(savedExpenses);
                if (Array.isArray(parsed)) {
                    setExpenses(parsed);
                }
            } catch {
                // handle later
            }
        }
    }, []);

    const saveExpenses = (data: Expense[]) => {
        setExpenses(data);
        localStorage.setItem(LOCAL_STORAGE_EXPENSES, JSON.stringify(data));
    };

    const handleCurrencyChange = (opt: { code: string; symbol: string }) => {
        setCurrency(opt);
        localStorage.setItem(LOCAL_STORAGE_CURRENCY, JSON.stringify(opt));
    };

    const handleAddExpense = () => {
        if (!newExpense.source || !newExpense.amount || !newExpense.date) return;

        const newEntry: Expense = {
            id: Date.now(),
            source: toSentenceCase(newExpense.source),
            amount: parseFloat(newExpense.amount),
            date: newExpense.date,
        };

        const updated = [...expenses, newEntry];
        saveExpenses(updated);

        setNewExpense({
            source: "",
            amount: "",
            date: new Date().toISOString().split("T")[0],
        });
    };

    const generateRandomData = () => {
        const now = new Date();
        const newEntries: Expense[] = [];

        for (let d = 0; d < randomConfig.days; d++) {
            const day = new Date(now);
            day.setDate(now.getDate() - d);

            for (let s = 0; s < randomConfig.sources; s++) {
                newEntries.push({
                    id: Date.now() + d * 100 + s,
                    source: `Source ${s + 1}`,
                    amount: parseFloat((Math.random() * 3000 + 50).toFixed(2)),
                    date: day.toISOString().split("T")[0],
                });
            }
        }

        saveExpenses([...expenses, ...newEntries]);
    };

    const handleDelete = (id: number) => {
        saveExpenses(expenses.filter((e) => e.id !== id));
    };

    const handleDeleteAll = () => {
        const confirmed = confirm("Are you sure you want to delete all expenses?");
        if (confirmed) saveExpenses([]);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-semibold">Expenses</h1>
                <div className="flex gap-4 flex-wrap">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Expense
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="p-4 w-72 space-y-3">
                            <DropdownMenuLabel>Add new expense data</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <input
                                type="text"
                                placeholder="Source"
                                value={newExpense.source}
                                onChange={(e) =>
                                    setNewExpense({ ...newExpense, source: e.target.value })
                                }
                                className="w-full px-2 py-1 rounded border text-sm"
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={newExpense.amount}
                                onChange={(e) =>
                                    setNewExpense({ ...newExpense, amount: e.target.value })
                                }
                                className="w-full px-2 py-1 rounded border text-sm"
                            />
                            <input
                                type="date"
                                value={newExpense.date}
                                onChange={(e) =>
                                    setNewExpense({ ...newExpense, date: e.target.value })
                                }
                                className="w-full px-2 py-1 rounded border text-sm"
                            />
                            <Button onClick={handleAddExpense} className="w-full text-sm">
                                Submit
                            </Button>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Data
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="p-4 w-72 space-y-3">
                            <DropdownMenuLabel>Generate Random Data</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <label className="text-sm font-medium">Number of Days</label>
                            <input
                                type="number"
                                value={randomConfig.days}
                                onChange={(e) =>
                                    setRandomConfig({ ...randomConfig, days: +e.target.value })
                                }
                                className="w-full px-2 py-1 border rounded text-sm"
                            />
                            <label className="text-sm font-medium">Sources per Day</label>
                            <input
                                type="number"
                                value={randomConfig.sources}
                                onChange={(e) =>
                                    setRandomConfig({ ...randomConfig, sources: +e.target.value })
                                }
                                className="w-full px-2 py-1 border rounded text-sm"
                            />
                            <Button onClick={generateRandomData} className="w-full text-sm">
                                Generate
                            </Button>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
                                {currency.code} ({currency.symbol})
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Select Currency</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {currencyOptions.map((opt) => (
                                <DropdownMenuItem
                                    key={opt.code}
                                    onClick={() => handleCurrencyChange(opt)}
                                >
                                    {opt.code} ({opt.symbol})
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="destructive" className="" onClick={handleDeleteAll}>
                        <Trash className="w-4 h-4 mr-2" />
                        Delete All
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <ExpenseTable
                        data={expenses}
                        currency={currency}
                        onDelete={handleDelete}
                    />
                </div>
                <div className="md:col-span-1">
                    <ExpenseChart data={expenses} currency={currency} />
                </div>
            </div>
        </div>
    );
}
