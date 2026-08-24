import { useIsMobile } from "@/hooks/use-mobile"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const isMobile = useIsMobile()
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      visibleToasts={5}
      theme={theme as ToasterProps["theme"]}
      className="toaster group pointer-events-auto!"
      toastOptions={{
        descriptionClassName: 'text-muted-foreground!',
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--width": isMobile ? "356px": "400px",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
