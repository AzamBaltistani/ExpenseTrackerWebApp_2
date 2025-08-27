import {
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
} from "recharts"

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
    incomes: { source: string; amount: number }[]
    expenses: { source: string; amount: number }[]
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

export function RadarChartBySource({ incomes, expenses, currency }: Props) {
    const sourceMap = new Map<string, { income: number; expense: number }>()

    incomes.forEach(({ source, amount }) => {
        if (!sourceMap.has(source)) {
            sourceMap.set(source, { income: 0, expense: 0 })
        }
        sourceMap.get(source)!.income += amount
    })

    expenses.forEach(({ source, amount }) => {
        if (!sourceMap.has(source)) {
            sourceMap.set(source, { income: 0, expense: 0 })
        }
        sourceMap.get(source)!.expense += amount
    })

    const chartData = Array.from(sourceMap.entries()).map(([source, data]) => ({
        source,
        income: Number(data.income.toFixed(2)),
        expense: Number(data.expense.toFixed(2)),
    }))

    return (
        <Card className="w-full h-full">
            <CardHeader className="items-center pb-4">
                <CardTitle>Radar Chart - By Source</CardTitle>
                <CardDescription>
                    Comparing income and expense across all sources
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-0 w-full h-full">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] "
                >
                    <RadarChart data={chartData}>
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="line"
                                    formatter={(value, name) => {
                                        const label =
                                            chartConfig[name as keyof typeof chartConfig]?.label || name
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
                        <PolarAngleAxis dataKey="source" />
                        <PolarGrid radialLines={false} />
                        <Radar
                            dataKey="income"
                            fill="var(--color-income)"
                            fillOpacity={0}
                            stroke="var(--color-income)"
                            strokeWidth={2}
                        />
                        <Radar
                            dataKey="expense"
                            fill="var(--color-expense)"
                            fillOpacity={0}
                            stroke="var(--color-expense)"
                            strokeWidth={2}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
