import { CardTitle } from "@/components/ui/card"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { SquareUserRound } from "lucide-react"

export function NotificationSettings() {

    const onFormSubmit = () => { }
    const isSubmitting = false

    return (
        <form onSubmit={onFormSubmit}>

            <fieldset disabled={isSubmitting} className='space-y-5'>
                <FieldLabel htmlFor="switch-focus-mode" className="cursor-pointer">
                    <Field orientation="horizontal" className="justify-between">
                        <FieldContent>
                            <FieldContent>
                                <FieldTitle>Email notifications</FieldTitle>
                                <FieldDescription>
                                    Activar/desactivar correos sobre fechas límite de envío de abstracts, aceptación de trabajos y estados de registro.
                                </FieldDescription>
                            </FieldContent>
                        </FieldContent>
                        <div className="hover:scale-110 transition-transform duration-300">
                            <Switch
                                id="switch-focus-mode"
                                className="bg-destructive/30"
                            />
                        </div>
                    </Field>
                </FieldLabel>

                <FieldLabel htmlFor="switch-focus-mode" className="cursor-pointer">
                    <Field orientation="horizontal" className="justify-between">
                        <FieldContent>
                            <FieldContent>
                                <FieldTitle>Congress Alerts</FieldTitle>
                                <FieldDescription>
                                    Activar/desactivar correos sobre el evento.
                                </FieldDescription>
                            </FieldContent>
                        </FieldContent>
                        <div className="hover:scale-110 transition-transform duration-300">
                            <Switch
                                id="switch-focus-mode"
                                className="bg-destructive/30"
                            />
                        </div>
                    </Field>
                </FieldLabel>

            </fieldset>
        </form >
    )
}
