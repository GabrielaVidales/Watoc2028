import { Checkbox } from "@/components/ui/checkbox"
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "@/components/ui/combobox"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AvatarUpload } from "@/components/ui/upload-avatar"
import { userPrefixes, userRoles } from "@/domain/constants"
import { editUserFormSchema, type EditUserFormValues } from "@/features/auth/schemas/edit-user-schema"
import { countries } from "@/utils/countriesInfo"
import { zodResolver } from "@hookform/resolvers/zod"
import { IdCard, UserSquare2 } from "lucide-react"
import React, { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"


type AdminEditUserFormProps = {
    values?: EditUserFormValues
}

export function AdminEditUserForm({ values = null }: AdminEditUserFormProps) {
    const anchor = useComboboxAnchor()

    const { control, handleSubmit, reset, watch, formState: { isValid, isSubmitting } } = useForm<EditUserFormValues>({
        resolver: zodResolver(editUserFormSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            prefix: 'not-set',
            city: '',
            email_verified: false,
            id: null,
            is_active: true,
            nationality: '',
            photo: '',
            photo_file: null,
            roles: []
        }
    })

    const onFormSubmit = handleSubmit(async (data) => {
        console.log(data)
    })

    useEffect(() => {
        if (values) {
            queueMicrotask(() => reset(values))
        }
    }, [values])

    const formName = 'admin-edit-user-form'
    return (
        <form onSubmit={onFormSubmit} noValidate id={formName}>
            <fieldset className="space-y-6 p-1" disabled={isSubmitting}>
                <div className="flex gap-3 items-center">
                    <UserSquare2 className='text-primary-main' />
                    <h2 className='text-xl font-semibold'>Profile Picture</h2>
                </div>


                <Controller
                    name='photo_file'
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <AvatarUpload
                                accept=".png,.jpg,.jpeg,.webp"
                                defaultAvatar={values.photo}
                                onFileChange={(files) => {
                                    queueMicrotask(() => {
                                        field.onChange(files?.file || null)
                                    })
                                }}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="delete_photo"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                            <Checkbox
                                id={field.name}
                                name={field.name}
                                aria-invalid={fieldState.invalid}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className='size-5'
                            />
                            <FieldLabel htmlFor={field.name} className="font-normal cursor-pointer">
                                Delete photo
                            </FieldLabel>
                        </Field>
                    )}
                />

                <div className="flex gap-3 items-center">
                    <IdCard className='text-primary-main' />
                    <h2 className='text-xl font-semibold'>Personal Information</h2>
                </div>

                <section className="grid grid-cols-3 gap-4">
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="First name"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="middleName"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Middle name</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Middle name"
                                    autoComplete="off"
                                />
                                <FieldDescription>Optional field *</FieldDescription>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="First name"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="prefix"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-select-prefix">Prefix</FieldLabel>
                                <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger
                                        id="form-select-prefix"
                                        aria-invalid={fieldState.invalid}
                                        className="min-w-30"
                                    >
                                        <SelectValue placeholder="Choose..." />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                        <SelectItem value="placeholder-invalid" disabled>
                                            Choose an option
                                        </SelectItem>
                                        {userPrefixes.map(p => (
                                            <SelectItem value={p.value} key={p.value}>{p.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="nationality"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldLabel htmlFor="form-select-nationality">Nationality</FieldLabel>
                                </FieldContent>
                                <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger
                                        id="form-select-nationality"
                                        aria-invalid={fieldState.invalid}
                                        className="min-w-30"
                                    >
                                        <SelectValue placeholder="Country..." />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                        {countries
                                            .sort((a, b) => a.label.localeCompare(b.label))
                                            .map(c => (
                                                <SelectItem value={c.value as string} key={c.value}>
                                                    <img
                                                        loading="lazy"
                                                        width="20"
                                                        srcSet={`https://flagcdn.com/w40/${c.value.toString().toLowerCase()}.png 2x`}
                                                        src={`https://flagcdn.com/w20/${c.value.toString().toLowerCase()}.png`}
                                                        alt=""
                                                    />
                                                    {c.label}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="city"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}   >City</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="City"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </section>

                <Separator />

                <section className="space-y-4">
                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    type='email'
                                    placeholder="name@example.com"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="roles"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Roles</FieldLabel>
                                <Combobox
                                    {...field}
                                    multiple
                                    autoHighlight
                                    items={userRoles}
                                    itemToStringValue={i => i.value}
                                    itemToStringLabel={i => i.label}
                                    value={userRoles.filter(role => field.value?.includes(role.value))}
                                    onValueChange={(roles) => field.onChange(roles.map(r => r.value))}
                                >
                                    <ComboboxChips ref={anchor} className="w-full">
                                        <ComboboxValue>
                                            {(values) => (
                                                <React.Fragment>
                                                    {values.map((value) => (
                                                        <ComboboxChip key={value.value}>{value.label}</ComboboxChip>
                                                    ))}
                                                    {values.length < userRoles.length && (
                                                        <ComboboxChipsInput
                                                            id={field.name}
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder={values.length === 0 ? "Select user role" : ""}
                                                        />
                                                    )}
                                                </React.Fragment>
                                            )}
                                        </ComboboxValue>
                                    </ComboboxChips>
                                    <ComboboxContent anchor={anchor}>
                                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => (
                                                <ComboboxItem key={item.value} value={item}>
                                                    {item.label}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="is_active"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <Checkbox
                                    id={field.name}
                                    name={field.name}
                                    aria-invalid={fieldState.invalid}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className='size-5'
                                />
                                <FieldLabel htmlFor={field.name} className="font-normal cursor-pointer">
                                    User is active
                                </FieldLabel>
                            </Field>
                        )}
                    />
                    <Controller
                        name="email_verified"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <Checkbox
                                    id={field.name}
                                    name={field.name}
                                    aria-invalid={fieldState.invalid}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className='size-5'
                                />
                                <FieldLabel htmlFor={field.name} className="font-normal cursor-pointer">
                                    Email is verified
                                </FieldLabel>
                            </Field>
                        )}
                    />
                </section>
            </fieldset>
        </form>
    )
}

