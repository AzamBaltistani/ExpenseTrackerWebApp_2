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
import type { Income } from "@/pages/Incomes";

interface Props {
    data: Income[];
    currency: { code: string; symbol: string };
}

const COLORS = ["#4f46e5", "#06b6d4", "#16a34a", "#f59e0b", "#ef4444", "#7c3aed"];

const chartConfig = {
    amount: {
        label: "Income",
        color: "var(--chart-1)",
    },
};

function toSentenceCase(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function groupBySource(data: Income[]) {
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

export function IncomeChart({ data, currency }: Props) {
    const sourceData = groupBySource(data);

    return (
        <div className="space-y-6">
            {/* Bar Chart by Source */}
            <Card>
                <CardHeader>
                    <CardTitle>Income Overview</CardTitle>
                    <CardDescription>Source-wise breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <BarChart data={sourceData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="source"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis
                                tickLine={false}
                                tickFormatter={(value) =>
                                    `${currency.symbol}${value.toLocaleString()}`
                                }
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar
                                dataKey="amount"
                                fill="var(--color-income, var(--chart-1))"
                                radius={8}
                            />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Pie Chart by Source */}
            <Card>
                <CardHeader>
                    <CardTitle>Income Source Distribution</CardTitle>
                    <CardDescription>See percentage share by source</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={sourceData}
                                dataKey="amount"
                                nameKey="source"
                                outerRadius={80}
                                fill="#8884d8"
                                label={(entry) => entry.source}
                            >
                                {sourceData.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) =>
                                    `${currency.symbol}${value.toLocaleString()}`
                                }
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
