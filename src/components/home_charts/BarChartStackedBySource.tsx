import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
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

export function BarChartStackedBySource({
    incomes,
    expenses,
    currency,
}: Props) {
    // Aggregate total income and expense per source
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

    const chartData = Array.from(sourceMap.entries()).map(([source, value]) => ({
        source,
        income: Number(value.income.toFixed(2)),
        expense: Number(value.expense.toFixed(2)),
    }))

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Stacked Bar Chart - By Source</CardTitle>
                <CardDescription>Total income and expenses per source</CardDescription>
            </CardHeader>
            <CardContent className="h-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="source"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value}
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

                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                            dataKey="income"
                            stackId="a"
                            fill="var(--chart-2)"
                            radius={[0, 0, 4, 4]}
                        />
                        <Bar
                            dataKey="expense"
                            stackId="a"
                            fill="var(--chart-1)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
