import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
    return (
        <section className="px-8 py-16 w-full flex items-center gap-8 justify-center flex-col">
            <Card className="w-full md:max-w-[480px]">
                <CardHeader>
                    <CardTitle>Report a bug.</CardTitle>
                    <CardDescription>We will try to fix it as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" action="https://docs.google.com/forms/d/e/1FAIpQLScJK9VoDaFsxloPIdOmsXUIjY-Br39khMNvEuHgggZq2M3xlg/formResponse">
                        <div className="space-y-2">
                            <Label htmlFor="entry.608808182">Username (optional, for account identification)</Label>
                            <Input name="entry.608808182" placeholder="Username" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="entry.1432853799">Email (optional, for account identification)</Label>
                            <Input name="entry.1432853799" placeholder="Email" type="email" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="entry.1063352119">Describe the bug</Label>
                            <Textarea name="entry.1063352119" placeholder="Description" required={true} />
                        </div>
                        <Button type="submit" size="lg">Send bug report</Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    )
}
