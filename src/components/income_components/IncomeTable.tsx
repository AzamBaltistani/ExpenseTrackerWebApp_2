import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Income } from "@/pages/Incomes";

interface Props {
    data: Income[];
    currency: { code: string; symbol: string };
    onDelete: (id: number) => void;
}

export function IncomeTable({ data, currency, onDelete }: Props) {
    const total = data.reduce((sum, income) => sum + income.amount, 0);

    return (
        <div className="rounded-lg shadow dark:shadow-white dark:bg-neutral-900 p-4">
            <Table>
                <TableCaption>Income History ({currency.code})</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Amount ({currency.symbol})</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((income) => (
                        <TableRow key={income.id}>
                            <TableCell>{income.source}</TableCell>
                            <TableCell>
                                {currency.symbol} {income.amount.toFixed(3)}
                            </TableCell>
                            <TableCell>{income.date}</TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => onDelete(income.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell className="font-medium">Total</TableCell>
                        <TableCell className="font-bold">
                            {currency.symbol} {total.toFixed(3)}
                        </TableCell>
                        <TableCell />
                        <TableCell />
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}
