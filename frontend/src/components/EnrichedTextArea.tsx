import { useEditor, EditorContent } from "@tiptap/react"
import Placeholder from "@tiptap/extension-placeholder"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import ExtensionBold from "@tiptap/extension-bold"
import ExtensionItalic from "@tiptap/extension-italic"
import Underline from "@tiptap/extension-underline"
import History from "@tiptap/extension-history"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Document from '@tiptap/extension-document'

import { Bold, Italic, UnderlineIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, type ReactNode } from "react"

type AddonsOptions = {
    bold?: boolean
    underline?: boolean
    italic?: boolean
    sup?: boolean
    sub?: boolean
}

const defaultAddons: AddonsOptions = {
    bold: true,
    italic: true,
    sub: true,
    sup: true,
    underline: true
}

const ALLOWED = new Set(['P', 'B', 'STRONG', 'I', 'EM', 'SUP', 'SUB', 'BR'])

function cleanHTML(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html')

    doc.body.querySelectorAll('script,style,noscript,meta,link').forEach(el => el.remove())

    const walk = (node) => {
        ;[...node.children].forEach(walk)
        if (node === doc.body) return

        if (ALLOWED.has(node.tagName)) {
            ;[...node.attributes].forEach(a => node.removeAttribute(a.name))
        } else {
            node.replaceWith(...node.childNodes)
        }
    }

    walk(doc.body)
    return doc.body.innerHTML
}

type RichTextEditorProps = {
    value?: string
    addonsOptions?: AddonsOptions
    invalid?: boolean,
    footer?: ReactNode
    multiline?: boolean
    onChange?: (value: string) => void
    onBlur?: () => void
} & React.ComponentProps<"textarea">

export default function RichTextEditor({
    value,
    addonsOptions,
    invalid,
    multiline = true,
    placeholder,
    onBlur,
    footer,
    disabled,
    className,
    onChange,
    maxLength,
    autoComplete,
    autoCorrect,
    spellCheck,
    name,
    id,
}: RichTextEditorProps) {

    const addonsConfig: AddonsOptions = {
        ...defaultAddons,
        ...addonsOptions,
    }

    const editor = useEditor({
        editorProps: {
            transformPastedHTML: cleanHTML,
            handleKeyDown({ }, event) {
                if (!multiline && event.key === "Enter") {
                    event.preventDefault()
                    return true
                }

                return false
            },
            attributes: {
                id,
                name,
                autocomplete: autoComplete,
                autocorrect: autoCorrect,
                spellcheck: spellCheck ? "true" : "false",
                maxlength: maxLength?.toString(),
                class: cn(
                    "ProseMirror w-full min-w-0 max-w-full bg-background p-2 px-3 text-sm outline-none max-w-none",
                    "break-all",
                    "[&_p]:wrap-anywhere",
                    "[&_li]:wrap-anywhere",
                    "[&_p]:my-0 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-bold",
                    "[&_ul]:list-disc [&_ul]:ml-6 [&_strong]:font-bold [&_em]:italic [&_u]:underline",
                    "before:text-muted-foreground before:content-[attr(data-placeholder)]",
                    "before:float-left before:h-0 before:pointer-events-none overflow-y-auto",
                    className
                ),
            },
        },
        extensions: [
            History,
            Document.extend({
                content: multiline ? "block+" : "inline*",
            }),
            ...(multiline ? [Paragraph] : []),
            Text,
            (addonsConfig.bold && ExtensionBold),
            (addonsConfig.italic && ExtensionItalic),
            (addonsConfig.underline && Underline),
            (addonsConfig.sub && Subscript),
            (addonsConfig.sup && Superscript),
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
                "group/editor relative w-full min-w-0 overflow-hidden rounded-md border border-input bg-background shadow-xs transition-[color,box-shadow] outline-none",
                "focus-within:border-primary-light",
                "focus-within:ring-primary-light/50",
                "focus-within:ring-[3px]",
                "aria-invalid:border-destructive",
                "aria-invalid:focus-within:ring-destructive/20",
                "aria-invalid:focus-within:border-destructive"
            )}
        >
            <div className={cn("flex items-center gap-2 border-b bg-muted/40 p-1")}>
                {addonsConfig.bold && (
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()}>
                        <Bold className="h-4 w-4" />
                    </ToolbarButton>
                )}

                {addonsConfig.italic && (
                    <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()}>
                        <Italic className="h-4 w-4" />
                    </ToolbarButton>
                )}

                {addonsConfig.underline && (
                    <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()}>
                        <UnderlineIcon className="h-4 w-4" />
                    </ToolbarButton>
                )}

                {addonsConfig.sub && (
                    <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()}>
                        X₂
                    </ToolbarButton>
                )}

                {addonsConfig.sup && (
                    <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()}>
                        X²
                    </ToolbarButton>
                )}
            </div>

            <EditorContent editor={editor} className="tiptap w-full min-w-0 max-w-full" />

            {footer && (
                <div className="flex py-1 px-3 w-full">
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
            className={cn("size-7")}
        >
            {children}
        </Button>
    )
}

export function decodeHtml(html: string) {
    const txt = document.createElement("textarea")
    txt.innerHTML = html
    return txt.value
}

export function countWordsFromHTML(html: string) {
    const div = document.createElement("div")
    div.innerHTML = html
    return div.textContent
        ?.trim()
        .split(/\s+/)
        .filter(Boolean)
        .length ?? 0
}

