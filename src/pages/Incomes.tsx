import { useEffect, useState } from "react";
import { Plus, Sparkles, Trash } from "lucide-react";
import { IncomeChart } from "@/components/income_components/IncomeChart";
import { IncomeTable } from "@/components/income_components/IncomeTable";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export interface Income {
    id: number;
    source: string;
    amount: number;
    date: string;
}

const currencyOptions = [
    { code: "PKR", symbol: "Rs" },
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
];

const LOCAL_STORAGE_CURRENCY = "selected_currency";
const LOCAL_STORAGE_INCOMES = "incomes";

const toSentenceCase = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const Incomes = () => {
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [currency, setCurrency] = useState<{ code: string; symbol: string }>({
        code: "USD",
        symbol: "$",
    });

    const [newIncome, setNewIncome] = useState({
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

        const savedIncomes = localStorage.getItem(LOCAL_STORAGE_INCOMES);
        if (savedIncomes) {
            try {
                const parsed = JSON.parse(savedIncomes);
                if (Array.isArray(parsed)) {
                    setIncomes(parsed);
                }
            } catch {
                // handle later
            }
        }
    }, []);

    const saveIncomes = (data: Income[]) => {
        setIncomes(data);
        localStorage.setItem(LOCAL_STORAGE_INCOMES, JSON.stringify(data));
    };

    const handleCurrencyChange = (opt: { code: string; symbol: string }) => {
        setCurrency(opt);
        localStorage.setItem(LOCAL_STORAGE_CURRENCY, JSON.stringify(opt));
    };

    const handleAddIncome = () => {
        if (!newIncome.source || !newIncome.amount || !newIncome.date) return;

        const newEntry: Income = {
            id: Date.now(),
            source: toSentenceCase(newIncome.source),
            amount: parseFloat(newIncome.amount),
            date: newIncome.date,
        };

        const updated = [...incomes, newEntry];
        saveIncomes(updated);

        setNewIncome({
            source: "",
            amount: "",
            date: new Date().toISOString().split("T")[0],
        });
    };

    const generateRandomData = () => {
        const now = new Date();
        const newEntries: Income[] = [];

        for (let d = 0; d < randomConfig.days; d++) {
            const day = new Date(now);
            day.setDate(now.getDate() - d);

            for (let s = 0; s < randomConfig.sources; s++) {
                newEntries.push({
                    id: Date.now() + d * 100 + s,
                    source: `Source ${s + 1}`,
                    amount: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
                    date: day.toISOString().split("T")[0],
                });
            }
        }

        const updated = [...incomes, ...newEntries];
        saveIncomes(updated);
    };

    const handleDelete = (id: number) => {
        const updated = incomes.filter((income) => income.id !== id);
        saveIncomes(updated);
    };

    const handleDeleteAll = () => {
        const confirmed = confirm("Are you sure you want to delete all income records?");
        if (confirmed) {
            saveIncomes([]);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Title + Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-semibold">Incomes</h1>
                <div className="flex gap-4 flex-wrap">
                    {/* Add New Income Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Income
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="p-4 w-72 space-y-3">
                            <DropdownMenuLabel>Add new income data</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <input
                                type="text"
                                placeholder="Source"
                                value={newIncome.source}
                                onChange={(e) =>
                                    setNewIncome({ ...newIncome, source: e.target.value })
                                }
                                className="w-full px-2 py-1 rounded border text-sm"
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={newIncome.amount}
                                onChange={(e) =>
                                    setNewIncome({ ...newIncome, amount: e.target.value })
                                }
                                className="w-full px-2 py-1 rounded border text-sm"
                            />
                            <input
                                type="date"
                                value={newIncome.date}
                                onChange={(e) =>
                                    setNewIncome({ ...newIncome, date: e.target.value })
                                }
                                className="w-full px-2 py-1 rounded border text-sm"
                            />
                            <Button onClick={handleAddIncome} className="w-full text-sm">
                                Submit
                            </Button>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Generate Random Data Dropdown */}
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
                                    setRandomConfig({
                                        ...randomConfig,
                                        days: parseInt(e.target.value),
                                    })
                                }
                                className="w-full px-2 py-1 rounded border text-sm"
                            />
                            <label className="text-sm font-medium">Sources per Day</label>
                            <input
                                type="number"
                                value={randomConfig.sources}
                                onChange={(e) =>
                                    setRandomConfig({
                                        ...randomConfig,
                                        sources: parseInt(e.target.value),
                                    })
                                }
                                className="w-full px-2 py-1 rounded border text-sm"
                            />
                            <Button onClick={generateRandomData} className="w-full text-sm">
                                Generate
                            </Button>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Currency Selector */}
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

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <IncomeTable
                        data={incomes}
                        currency={currency}
                        onDelete={handleDelete}
                    />
                </div>
                <div className="md:col-span-1">
                    <IncomeChart data={incomes} currency={currency} />
                </div>
            </div>
        </div>
    );
};

export default Incomes;
