import ShowAffiliations from '@/components/ShowAffiliations'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import AffiliationForm from '@/forms/AffiliationForm'
import type { Affiliation } from '@/schemas/affiliation-schema'
import { Plus, X } from 'lucide-react'
import React from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Sockets from './socket'

function TestPage() {
    const [data, setData] = React.useState<Affiliation | null>(null)
    const [open, setOpen] = React.useState<boolean>(false)

    return (
        <div className='flex w-full gap-4 p-4'>
            <Sockets/>

            <Dialog open={open} onOpenChange={() => { setOpen(false); setData(null); }}>
                <DialogContent className='max-w-md w-full'>
                    <DialogHeader>
                        <DialogTitle>{data !== null ? 'Edit Affiliation' : 'New Affiliation'}</DialogTitle>
                        <DialogDescription>
                            {data !== null
                                ? 'Update the necessary fields below and save your changes.'
                                : 'Fill out the form below to add a new affiliation to the list.'}
                        </DialogDescription>
                    </DialogHeader>
                    <AffiliationForm
                        id='affiliation-form'
                        defaults={data}
                        onSubmitSuccess={() => { setOpen(false); setData(null); }}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" form='affiliation-form'>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card className='max-w-sm w-full mx-auto'>
                <CardHeader>
                    <CardTitle>Manage Affiliations</CardTitle>
                    <CardDescription>
                        View, create, edit, or remove affiliation records for your organization.
                    </CardDescription>
                    <CardAction>
                        <Button onClick={() => { setData(null); setOpen(true) }}>
                            <Plus />
                            New
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className='pr-2 border-y'>
                    <div className="h-100 space-y-4 overflow-y-scroll py-4 text-sm leading-relaxed">
                        <ShowAffiliations onAffiliationClicked={a => { setData(a); setOpen(a !== null) }} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default TestPage