import { type ButtonHTMLAttributes, forwardRef } from "react"
import { Plus } from "lucide-react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "floating"
  icon?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", icon, children, ...props }, ref) => {
    const baseStyles = "transition-all duration-200 font-medium"
    
    const variants = {
      primary: "bg-gradient-to-r from-pink-500 to-fuchsia-800 text-white hover:opacity-90",
      secondary: "border border-pink-600 text-pink-600 hover:bg-pink-50",
      floating: "fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-fuchsia-800 flex items-center justify-center hover:scale-105"
    }

    const buttonStyles = variant === "floating"
      ? `${baseStyles} ${variants.floating}`
      : `${baseStyles} ${variants[variant]} px-6 py-3 rounded-lg w-full`

    return (
      <button 
        className={`${buttonStyles} ${className}`}
        ref={ref}
        {...props}
      >
        {variant === "floating" && icon ? (
          <Plus className="w-6 h-6 text-white" />
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = "Button"