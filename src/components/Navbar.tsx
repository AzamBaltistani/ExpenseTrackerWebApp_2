import { FileSpreadsheet, Settings } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { ThemeModeToggle } from "./ThemeModeToggle"
import { Button } from "./ui/button"
import { SidebarTrigger } from "./ui/sidebar"

type Transaction = {
    id: string;
    source: string;
    amount: number;
    date: string;
};

const Navbar = () => {
    const handleExportCSV = () => {
        const incomes: Transaction[] = JSON.parse(localStorage.getItem("incomes") || "[]")
        const expenses: Transaction[] = JSON.parse(localStorage.getItem("expenses") || "[]")

        const allData = [
            ...incomes.map((d) => ({ ...d, type: "income" })),
            ...expenses.map((d) => ({ ...d, type: "expense" })),
        ]

        if (allData.length === 0) {
            alert("No data available to export.")
            return
        }

        const headers = ["id", "type", "source", "amount", "date"] as const;
        type Header = typeof headers[number];
        const csvRows = [
            headers.join(","), // header row
            ...allData.map((item) =>
                headers.map((key) => `"${item[key as Header]}"`).join(",")
            ),
        ]

        const csvContent = csvRows.join("\n")
        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = "transactions.csv"
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <nav className="flex justify-between w-full items-center border-b py-1">
            {/* Left Side */}
            <div className="flex w-full h-full justify-start items-center">
                <SidebarTrigger />
                <span className="sr-only">Sidebar Trigger Button</span>
            </div>

            {/* Right Side */}
            <div className="flex justify-end w-full gap-4 items-center pr-4">
                <ThemeModeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Settings className="mr-1" />
                            <span className="sr-only">Data Options Menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Data Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleExportCSV}>
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Export as CSV
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}

export default Navbar
