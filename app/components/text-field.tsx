import { cn } from "@/lib/utils"
import { type InputHTMLAttributes, forwardRef } from "react"

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  onCancel?:()=> void
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full my-3 space-y-2">
      <label className="text-white text-[20px] font-medium">{label}</label>
      <input
        className={cn(
          "w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder:text-gray-400",
          "border border-transparent focus:border-pink-600 focus:outline-none",
          error && "border-red-500",
          className,
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
})
TextField.displayName = "TextField"

