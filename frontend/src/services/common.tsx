

import { type FieldValues, type UseFormSetError, type Path } from 'react-hook-form'
import { isAxiosError } from 'axios'

interface NotifyOptions {
    destructive: (title: string, options?: { description?: React.ReactNode; onDismiss?: () => void; onAutoClose?: () => void }) => void
}

export function handleApiFormError<T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>,
    notify: NotifyOptions,
    clearErrors?: () => void
) {
    if (!isAxiosError(error) || !error.response?.data?.errors) {
        notify.destructive('Something went wrong!')
        return
    }

    const errors = error.response.data.errors

    const title = Array.isArray(errors.root)
        ? errors.root.join('. ')
        : 'Something went wrong!'

    const errorMessages: string[] = []
    Object.entries(errors)
        .forEach(([key, value]) => {
            if (key === 'root') return

            const message = Array.isArray(value) ? value.join('. ') : String(value)
            errorMessages.push(message)

            setError(key as Path<T>, {
                type: 'server',
                message,
            }, { shouldFocus: true })
        })

    const description = errorMessages.length > 0 ? (
        <>
            {errorMessages.map((msg, index) => (
                <p key={index} > {msg} </p>
            ))}
        </>
    ) : undefined

    notify.destructive(title, {
        description,
        onDismiss: () => clearErrors?.(),
        onAutoClose: () => clearErrors?.(),
    })
}