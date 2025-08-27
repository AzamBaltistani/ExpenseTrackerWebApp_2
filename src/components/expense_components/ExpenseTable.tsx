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
import type { Expense } from "@/pages/Expenses";

interface Props {
    data: Expense[];
    currency: { code: string; symbol: string };
    onDelete: (id: number) => void;
}

export function ExpenseTable({ data, currency, onDelete }: Props) {
    const total = data.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="rounded-lg shadow dark:shadow-white dark:bg-neutral-900 p-4">
            <Table>
                <TableCaption>Expense History ({currency.code})</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Amount ({currency.symbol})</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((e) => (
                        <TableRow key={e.id}>
                            <TableCell>{e.source}</TableCell>
                            <TableCell>
                                {currency.symbol} {e.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>{e.date}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="destructive" size="icon" onClick={() => onDelete(e.id)}>
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
                            {currency.symbol} {total.toFixed(2)}
                        </TableCell>
                        <TableCell />
                        <TableCell />
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}
