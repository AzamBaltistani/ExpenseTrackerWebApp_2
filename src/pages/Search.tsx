import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import {
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    ResponsiveContainer,
} from "recharts"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegendContent,
} from "@/components/ui/chart"

interface Transaction {
    id: number
    type: "income" | "expense"
    source: string
    amount: number
    date: string
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
}

export default function SearchFilterPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [data, setData] = useState<Transaction[]>([])
    const [query, setQuery] = useState(searchParams.get("query") || "")
    const [type, setType] = useState(searchParams.get("type") || "all")
    const [source, setSource] = useState(searchParams.get("source") || "all")
    const [from, setFrom] = useState(searchParams.get("from") || "")
    const [to, setTo] = useState(searchParams.get("to") || "")
    const [currency, setCurrency] = useState({ code: "USD", symbol: "$" })

    useEffect(() => {
        const inc = JSON.parse(localStorage.getItem("incomes") || "[]")
        const exp = JSON.parse(localStorage.getItem("expenses") || "[]")
        setCurrency(
            JSON.parse(localStorage.getItem("selected_currency") || `{"code":"USD","symbol":"$"}`)
        )
        setData([
            ...inc.map((d: Transaction) => ({ ...d, type: "income" })),
            ...exp.map((d: Transaction) => ({ ...d, type: "expense" })),
        ])
    }, [])

    useEffect(() => {
        const params = new URLSearchParams()
        if (query) params.set("query", query)
        if (type !== "all") params.set("type", type)
        if (source !== "all") params.set("source", source)
        if (from) params.set("from", from)
        if (to) params.set("to", to)
        setSearchParams(params)
    }, [query, type, source, from, to, setSearchParams])

    const filtered = useMemo(() => {
        return data.filter((d) => {
            const matchQuery = query === "" || d.source.toLowerCase().includes(query.toLowerCase())
            const matchType = type === "all" || d.type === type
            const matchSource = source === "all" || d.source === source
            const matchFrom = from === "" || new Date(d.date) >= new Date(from)
            const matchTo = to === "" || new Date(d.date) <= new Date(to)
            return matchQuery && matchType && matchSource && matchFrom && matchTo
        })
    }, [data, query, type, source, from, to])

    const uniqueSources = Array.from(new Set(data.map((d) => d.source)))
    const totalIncome = filtered.filter((d) => d.type === "income").reduce((a, c) => a + c.amount, 0)
    const totalExpense = filtered.filter((d) => d.type === "expense").reduce((a, c) => a + c.amount, 0)

    const areaChartData = useMemo(() => {
        const grouped: Record<string, { income: number; expense: number; date: string }> = {}

        filtered.forEach((t) => {
            const dateKey = t.date
            if (!grouped[dateKey]) {
                grouped[dateKey] = { income: 0, expense: 0, date: dateKey }
            }
            grouped[dateKey][t.type] += t.amount
        })

        return Object.values(grouped).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }, [filtered])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2 w-full">
            {/* Search + Totals */}
            <Card className="w-full col-span-1">
                <CardHeader>
                    <CardTitle>Search</CardTitle>
                    <CardDescription>
                        Currency: {currency.symbol} ({currency.code})
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Search source"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <ResponsiveContainer width="100%" height={150}>
                        <BarChart layout="vertical" data={[
                            { name: "Income", value: totalIncome },
                            { name: "Expense", value: totalExpense },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <Bar dataKey="value" fill="var(--chart-1)" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Area Chart */}
            <Card className="w-full md:col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Mini Chart</CardTitle>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 w-full h-full">
                    <ChartContainer config={chartConfig} className="aspect-auto w-full h-full">
                        <AreaChart data={areaChartData} className="w-full h-full">
                            <defs>
                                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
                            <YAxis tickFormatter={(v) => `${currency.symbol}${v}`} />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        className="w-[180px]"
                                        indicator="dot"
                                        formatter={(value, name, item, index) => {
                                            const color = `var(--color-${name})`
                                            const label = chartConfig[name as keyof typeof chartConfig]?.label || name
                                            const formattedValue = `${currency.symbol} ${Number(value).toLocaleString()}`
                                            const total = (item?.payload?.income ?? 0) + (item?.payload?.expense ?? 0)

                                            return (
                                                <>
                                                    <div className="flex w-full items-center gap-2 text-xs text-muted-foreground">
                                                        <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: color }} />
                                                        <span className="flex-1">{label}</span>
                                                        <span className="text-foreground font-mono font-medium tabular-nums">{formattedValue}</span>
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
                            <Area dataKey="income" type="monotone" fill="url(#incomeGradient)" stroke="var(--chart-2)" strokeWidth={2} />
                            <Area dataKey="expense" type="monotone" fill="url(#expenseGradient)" stroke="var(--chart-1)" strokeWidth={2} />
                            <ChartLegendContent />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card className="col-span-full w-full">
                <CardContent className="py-3 px-4">
                    <div className="flex flex-wrap gap-2 items-center justify-between text-sm">
                        {/* Type */}
                        <div className="flex items-center gap-2">
                            <Label>Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="income">Income</SelectItem>
                                        <SelectItem value="expense">Expense</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Source */}
                        <div className="flex items-center gap-2">
                            <Label>Source</Label>
                            <Select value={source} onValueChange={setSource}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="all">All</SelectItem>
                                        {uniqueSources.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Range */}
                        <div className="flex items-center gap-2">
                            <Label>Date Range</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[180px]">
                                        {from && to ? `${from} → ${to}` : "Select range"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-4 space-y-2 flex w-full">
                                    <Label>From</Label>
                                    <Calendar
                                        mode="single"
                                        selected={from ? new Date(from) : undefined}
                                        onSelect={(d) => setFrom(d?.toISOString().slice(0, 10) || "")}
                                    />
                                    <Label>To</Label>
                                    <Calendar
                                        mode="single"
                                        selected={to ? new Date(to) : undefined}
                                        onSelect={(d) => setTo(d?.toISOString().slice(0, 10) || "")}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Reset */}
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                setQuery("")
                                setType("all")
                                setSource("all")
                                setFrom("")
                                setTo("")
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="col-span-full space-y-1">
                {filtered.map((d) => (
                    <Card key={d.id} className="py-1">
                        <CardContent className="flex justify-between items-center px-3 py-2">
                            <div>
                                <div className="font-medium text-sm">{d.source}</div>
                                <div className="text-xs text-muted-foreground">{d.date}</div>
                            </div>
                            <div
                                className={
                                    d.type === "income" ? "text-green-600 text-sm" : "text-red-600 text-sm"
                                }
                            >
                                {d.type === "income" ? "+" : "-"}
                                {currency.symbol}
                                {d.amount.toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
