import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Bar,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import type { Expense } from "@/pages/Expenses";

interface Props {
    data: Expense[];
    currency: { code: string; symbol: string };
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7"];

function toSentenceCase(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function groupBySource(data: Expense[]) {
    const grouped: Record<string, number> = {};
    data.forEach((entry) => {
        const key = entry.source.toLowerCase();
        grouped[key] = (grouped[key] || 0) + entry.amount;
    });

    return Object.entries(grouped).map(([source, amount]) => ({
        source: toSentenceCase(source),
        amount,
    }));
}

export function ExpenseChart({ data, currency }: Props) {
    const sourceData = groupBySource(data);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>By source (Bar Chart)</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{ amount: { label: "Expense", color: COLORS[0] } }}>
                        <BarChart data={sourceData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="source" />
                            <YAxis
                                tickFormatter={(val) =>
                                    `${currency.symbol}${val.toLocaleString()}`
                                }
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="amount" radius={8} fill={COLORS[0]} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Source Distribution</CardTitle>
                    <CardDescription>Pie chart of expenses</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={sourceData}
                                dataKey="amount"
                                nameKey="source"
                                outerRadius={80}
                                label={(entry) => entry.source}
                            >
                                {sourceData.map((_, idx) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(val: number) =>
                                    `${currency.symbol}${val.toLocaleString()}`
                                }
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
