import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { H3 } from "@/components/ui/typography";
import CurrenciesJson from "@/lib/currencies.json"
import React from "react";

export default function Page() {
    return (
        <div className="space-y-8">
            <H3 className="mt-0">Settings</H3>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Currencies</CardTitle>
                    <CardDescription>
                        Deploy your new project in one-click.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="space-y-1">
                                <Label>Change displayed currency.</Label>
                                <p className="text-muted-foreground w-[480px]">Changing currency only changes what currency is displayed. It does not convert currency values.</p>
                            </div>
                            <Select defaultValue="INR">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a fruit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(CurrenciesJson).map(code => {
                                        return (
                                            <React.Fragment key={code}>
                                                {/** @ts-ignore */}
                                                <SelectItem value={code}>{CurrenciesJson[code].name}</SelectItem>
                                            </React.Fragment>
                                        )
                                    })
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label>Enable multi-currency.</Label>
                            <Input className="max-w-[200px]" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Date & Time</CardTitle>
                    <CardDescription>
                        Deploy your new project in one-click.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Label>Default formatting for dates.</Label>
                            <Select>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Date Formatting" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">
                                        DD/MM/YYYY
                                    </SelectItem>
                                    <SelectItem value="dark">
                                        MM/DD/YYYY
                                    </SelectItem>
                                    <SelectItem value="system">
                                        YYYY-MM-DD
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label>Custom formatting for dates.</Label>
                            <Input className="max-w-[200px]" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Themes</CardTitle>
                    <CardDescription>
                        Deploy your new project in one-click.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Label>Default formatting for dates.</Label>
                            <Select>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Date Formatting" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">
                                        DD/MM/YYYY
                                    </SelectItem>
                                    <SelectItem value="dark">
                                        MM/DD/YYYY
                                    </SelectItem>
                                    <SelectItem value="system">
                                        YYYY-MM-DD
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label>Custom formatting for dates.</Label>
                            <Input className="max-w-[200px]" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex w-full items-center justify-end">
                <Button>Save changes</Button>
            </div>
        </div>
    );
}
