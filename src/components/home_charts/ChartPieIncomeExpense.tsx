import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

interface Props {
    incomes: { amount: number }[]
    expenses: { amount: number }[]
    currency: { code: string; symbol: string }
}

const chartConfig = {
    income: {
        label: "Income",
        color: "var(--chart-2)",
    },
    expense: {
        label: "Expense",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function ChartPieIncomeExpense({ incomes, expenses, currency }: Props) {
    const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0)
    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0)

    const chartData = [
        {
            type: "income",
            value: Number(totalIncome.toFixed(2)),
            fill: "var(--color-income)",
        },
        {
            type: "expense",
            value: Number(totalExpense.toFixed(2)),
            fill: "var(--color-expense)",
        },
    ]

    return (
        <Card className="flex flex-col w-full h-full">
            <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Income vs Expense</CardTitle>
                <CardDescription>Overall financial breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 w-full h-full">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={(value, name) => {
                                        const label = chartConfig[name as keyof typeof chartConfig]?.label || name
                                        return (
                                            <>
                                                <div className="text-muted-foreground flex items-center text-xs">
                                                    <span>{label}</span>
                                                    <div className="text-foreground ml-auto font-mono font-medium tabular-nums">
                                                        {currency.symbol}
                                                        {Number(value).toLocaleString()}
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }}
                                />
                            }
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="type"
                            innerRadius={60}
                            outerRadius={90}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
