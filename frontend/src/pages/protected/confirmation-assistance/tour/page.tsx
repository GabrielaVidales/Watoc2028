import React, { useEffect } from 'react'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '@/components/ui/field'
import { Controller, useForm } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { zodResolver } from '@hookform/resolvers/zod'
import { selectTourSchema, type SelectTourValues } from "@/schemas/select-tour-schema"
import { Separator } from '@/components/ui/separator'
import { useFetch } from '@/hooks/use-fetch'
import type { Tour } from '@/data/tours-data'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, } from "@/components/ui/combobox"
import { Link, useNavigate } from 'react-router'
import { urls } from '@/routes/routes'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRegistrationStore } from '@/data/store'
import { Spinner } from '@/components/ui/spinner'
import { SelectTourForm } from './select-tour-form'


export function SelectTourPage() {
    return (
        <div className='max-w-4xl mx-auto bg-background shadow-2xl space-y-3 my-6 border-t-8 border-t-primary-main rounded-sm overflow-hidden'>
            <section className='space-y-5 p-10 shadow-lg'>
                <h1 className='text-2xl font-medium text-primary-main'>Welcome to the WATOC 2028 Registration!</h1>
                <SelectTourForm />
            </section>


            <section className={cn(
                'flex justify-between items-start bg-primary-light/20',
                'px-10 py-3 mx-auto mt-auto bottom-0'
            )}>
                <Link to={urls.users.confirmAssistance.dinner}>
                    <Button type='button'>
                        <ChevronLeft /> Back
                    </Button>
                </Link>

                <Link to={urls.users.confirmAssistance.payment}>
                    <Button type='button'>
                        Next <ChevronRight />
                    </Button>
                </Link>
            </section>
        </div>
    )
}

