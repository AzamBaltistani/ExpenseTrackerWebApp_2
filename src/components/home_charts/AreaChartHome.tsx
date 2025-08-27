import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "../ui/chart";
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";

const chartConfig = {
    date: {
        label: "Date",
    },
    expense: {
        label: "Expense",
        color: "var(--chart-1)",
    },
    income: {
        label: "Income",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

interface MergedData {
    date: string;
    income: number;
    expense: number;
}

interface Props {
    chartData: MergedData[];
    currency: { code: string; symbol: string };
}

const AreaChartHome = ({ chartData, currency }: Props) => {
    const [timeRange, setTimeRange] = useState("90d");

    const filteredData = chartData.filter((item) => {
        const itemDate = new Date(item.date);
        const now = new Date();
        let daysToSubtract = 90;
        if (timeRange === "30d") daysToSubtract = 30;
        if (timeRange === "7d") daysToSubtract = 7;

        const startDate = new Date(now);
        startDate.setDate(now.getDate() - daysToSubtract);

        return itemDate >= startDate;
    });

    return (
        <Card className="pt-0 w-full h-full">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Area Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing incomes and expenses for the selected time range
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 w-full h-full">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto w-full h-full"
                >
                    <AreaChart data={filteredData} className="w-full h-full">
                        <defs>
                            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--chart-2)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--chart-2)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--chart-1)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--chart-1)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid vertical={false} strokeDasharray="3 3" />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${currency.symbol}${value}`}
                        />

                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[180px]"
                                    indicator="dot"
                                    formatter={(value, name, item, index) => {
                                        const color = `var(--color-${name})`
                                        const label = chartConfig[name as keyof typeof chartConfig]?.label || name
                                        const formattedValue = `${currency.symbol} ${Number(value).toLocaleString()}`

                                        const total =
                                            (item?.payload?.income ?? 0) + (item?.payload?.expense ?? 0)

                                        return (
                                            <>
                                                <div className="flex w-full items-center gap-2 text-xs text-muted-foreground">
                                                    <div
                                                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                    <span className="flex-1">{label}</span>
                                                    <span className="text-foreground font-mono font-medium tabular-nums">
                                                        {formattedValue}
                                                    </span>
                                                </div>
                                                {index === 1 && (
                                                    <div className="text-foreground mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
                                                        Total
                                                        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                                                            {currency.symbol} {total.toLocaleString()}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )
                                    }}
                                    labelFormatter={(label) =>
                                        new Date(label).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }
                                />
                            }
                        />

                        <Area
                            dataKey="income"
                            type="monotone"
                            fill="url(#incomeGradient)"
                            stroke="var(--chart-2)"
                            strokeWidth={2}
                        />
                        <Area
                            dataKey="expense"
                            type="monotone"
                            fill="url(#expenseGradient)"
                            stroke="var(--chart-1)"
                            strokeWidth={2}
                        />

                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default AreaChartHome;
