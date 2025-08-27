import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart"


interface MergedData {
    date: string
    income: number
    expense: number
}

interface Props {
    chartData: MergedData[]
    currency: { code: string; symbol: string }
}

const chartConfig = {
    views: {
        label: "Financial Overview",
    },
    income: {
        label: "Income",
        color: "var(--chart-2)",
    },
    expense: {
        label: "Expense",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function BarChartHome({ chartData, currency }: Props) {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("income")

    const total = React.useMemo(
        () => ({
            income: chartData.reduce((acc, curr) => acc + curr.income, 0),
            expense: chartData.reduce((acc, curr) => acc + curr.expense, 0),
        }),
        [chartData]
    )

    return (
        <Card className="py-0">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                    <CardTitle>Bar Chart - Income vs Expense</CardTitle>
                    <CardDescription>
                        Total {chartConfig[activeChart].label} for selected dates
                    </CardDescription>
                </div>
                <div className="flex">
                    {(["income", "expense"] as Array<keyof typeof total>).map((chart) => (
                        <button
                            key={chart}
                            data-active={activeChart === chart}
                            className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                            onClick={() => setActiveChart(chart)}
                        >
                            <span className="text-muted-foreground text-xs">
                                {chartConfig[chart].label}
                            </span>
                            <span className="text-lg leading-none font-bold sm:text-3xl">
                                {currency.symbol}
                                {total[chart].toLocaleString()}
                            </span>
                        </button>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey={chartConfig[activeChart].label}
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }
                                />
                            }
                        />
                        <Bar
                            dataKey={activeChart}
                            fill={
                                (activeChart === "income" || activeChart === "expense")
                                    ? chartConfig[activeChart].color
                                    : "#8884d8"
                            }
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
