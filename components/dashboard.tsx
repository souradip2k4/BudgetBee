"use client";

import { InteractiveBarChart } from "@/components/charts";
import LoadingSection from "@/components/loading-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMoney } from "@/lib/money-utils";
import { useUser } from "@clerk/nextjs";
import { QueryKey, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { addDays, format, subDays } from "date-fns";
import { Loading } from "./loading";
import { Skeleton } from "./ui/skeleton";
import { H3 } from "./ui/typography";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type DataPoints = {
    sum: {
        total: number;
        income: number;
        expense: number;
    };
    avg: {
        total: number;
        income: number;
        expense: number;
    };
    date: { date: string; total: number; income: number; expense: number }[];
    category: {
        name: string;
        total: number;
        income: number;
        expense: number;
    }[];
    max: {
        income: { date: Date; value: number }[];
        expense: { date: Date; value: number }[];
    };
};

function AmountCard({
    value,
    title,
}: {
    title: string;
    value: { total: number; income: number; expense: number } | undefined;
}) {
    return (
        <Card className="space-y-4">
            <CardHeader className="pb-0">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                <div className="flex justify-between gap-1">
                    <p>Income</p>
                    <Loading
                        isLoading={value === undefined}
                        fallback={<Skeleton className="h-4 w-[100px]" />}>
                        <p>{formatMoney(value?.income)}</p>
                    </Loading>
                </div>
                <div className="flex justify-between gap-1">
                    <p>Expense</p>
                    <Loading
                        isLoading={value === undefined}
                        fallback={<Skeleton className="h-4 w-[120px]" />}>
                        <p>{formatMoney(value?.income)}</p>
                    </Loading>

                </div>
                <Separator />
                <div className="flex justify-between gap-1">
                    <p>Total</p>
                    <Loading
                        isLoading={value === undefined}
                        fallback={<Skeleton className="h-4 w-[100px]" />}>
                        <CardTitle>{formatMoney(value?.total)}</CardTitle>
                    </Loading>
                </div>
            </CardContent>
        </Card>
    );
}

function TopEntriesCard({ values }: { values: DataPoints["max"] }) {
    const keys = [
        { key: "income", name: "Income" },
        { key: "expense", name: "Expense" },
    ] as const;
    return (
        <Card className="size-full">
            <CardHeader>
                <CardTitle>Most earned / spent</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="income">
                    <TabsList>
                        {keys.map(({ key, name }) => (
                            <TabsTrigger key={key} value={key}>
                                {name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {keys.map(({ key, name }) => (
                        <TabsContent key={key} value={key}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">
                                            {name}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {values[key].map(value => (
                                        <TableRow key={value.date.toString()}>
                                            <TableCell className="font-medium">
                                                {format(
                                                    value.date,
                                                    "EEE d MMM, yyyy",
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatMoney(value.value)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
}

type DateRange = {
    from: Date,
    to: Date
}

export default function Dashboard() {
    const { user } = useUser();

    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    })

    const query = useQuery<any, any, DataPoints | null>({
        queryKey: ["entries", user?.id],
        queryFn: async ({ queryKey }: { queryKey: QueryKey }) => {
            if (!queryKey[1]) return null;
            if (date === undefined) return null;
            const from = format(date.from, "yyyy-MM-dd");
            const to = format(date.to, "yyyy-MM-dd");
            try {
                const res = await axios.get(
                    `/api/users/${queryKey[1]}/entries/_datapoints?from=${from}&to=${to}`,
                );
                return res.data as DataPoints;
            } catch {
                return null;
            }
        },
    });

    if (query.isError) throw new Error(query.error);

    return (
        <div className="flex flex-col gap-6">

            <H3 className="mt-0">Dashboard</H3>

            <div className={cn("flex items-center gap-2 max-sm:flex-col max-sm:items-start")}>
                <p>Filter by date: </p>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-[300px] flex justify-start items-center text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            // @ts-ignore
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>

                <Button onClick={() => query.refetch()}>Filter</Button>
            </div>

            <div className="grid grid-cols-1 grid-rows-[repeat(2,auto)] gap-4 lg:grid-cols-[3fr_1fr] lg:grid-rows-1">
                <div className="grid grid-rows-[repeat(2,auto)] gap-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <AmountCard title="Total" value={query.data?.sum} />
                        <AmountCard title="Average" value={query.data?.avg} />
                    </div>
                    {query.data?.date && (
                        <InteractiveBarChart chartData={query.data.date} total={query.data.sum} />
                    )}
                </div>
                <div>
                    {query.data && <TopEntriesCard values={query.data.max} />}
                </div>
            </div>
        </div>
    );
}
