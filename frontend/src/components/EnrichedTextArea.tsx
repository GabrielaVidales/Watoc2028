import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import { Bold, Italic, UnderlineIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, type ReactNode } from "react"


type RichTextEditorProps = {
    value?: string
    onChange?: (value: string) => void
    invalid?: boolean,
    onBlur?: () => void
    footer?: ReactNode
} & React.ComponentProps<"textarea">

export default function RichTextEditor({ value, invalid, placeholder, onBlur, footer, disabled, className, onChange, maxLength, autoComplete, autoCorrect, spellCheck, name, id }: RichTextEditorProps) {
    const editor = useEditor({
        editorProps: {
            attributes: {
                id,
                name,
                autocomplete: autoComplete,
                autocorrect: autoCorrect,
                spellcheck: spellCheck ? "true" : "false",
                maxlength: maxLength?.toString(),
                class: cn(
                    "ProseMirror min-h-0 w-full bg-background p-3 text-sm outline-none max-w-none",
                    "[&_p]:wrap-anywhere",
                    "[&_li]:wrap-anywhere",
                    "[&_p]:my-2 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-bold",
                    "[&_ul]:list-disc [&_ul]:ml-6 [&_strong]:font-bold [&_em]:italic [&_u]:underline",
                    "before:text-muted-foreground before:content-[attr(data-placeholder)]",
                    "before:float-left before:h-0 before:pointer-events-none overflow-y-auto",
                    className
                ),
            },
        },
        extensions: [
            StarterKit,
            Subscript,
            Superscript,
            Placeholder.configure({
                placeholder: placeholder || '',
                emptyEditorClass: "is-editor-empty",
            }),
        ],

        content: value || "",
        editable: !disabled,
        onUpdate({ editor }) {
            onChange?.(editor.getHTML())
        },
        onBlur() {
            onBlur?.()
        },
    })

    useEffect(() => {
        if (!editor) return

        const html = editor.getHTML()

        if (html !== (value || "")) {
            editor.commands.setContent(
                decodeHtml(value || ""),
            )
        }
    }, [value, editor])

    if (!editor) return null

    return (
        <div
            aria-invalid={invalid}
            className={cn(
                "group/editor relative w-full overflow-hidden rounded-md border border-input bg-background shadow-xs transition-[color,box-shadow] outline-none",

                "focus-within:border-ring",
                "focus-within:ring-ring/50",
                "focus-within:ring-[3px]",
                "aria-invalid:border-destructive",
                "aria-invalid:focus-within:ring-destructive/20",
                "aria-invalid:focus-within:border-destructive"
            )}
        >
            <div className={cn("flex items-center gap-2 border-b bg-muted/40 p-2")}>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <UnderlineIcon className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                >
                    X₂
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                >
                    X²
                </ToolbarButton>

            </div>

            <EditorContent editor={editor} className="tiptap max-h-full" />

            {footer && (
                <div className="flex p-3 w-full">
                    {footer}
                </div>
            )}
        </div>
    )
}

type ToolbarButtonProps = {
    onClick: () => void
    children: React.ReactNode
}

function ToolbarButton({ onClick, children, }: ToolbarButtonProps) {
    return (
        <Button
            type="button"
            size="icon"
            variant={"ghost"}
            onClick={onClick}
            className={cn("h-8 w-8")}
        >
            {children}
        </Button>
    )
}

function decodeHtml(html: string) {
    const txt = document.createElement("textarea")
    txt.innerHTML = html
    return txt.value
}