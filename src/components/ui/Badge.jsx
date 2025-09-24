export const Badge = ({
  children,
  variant = "default",
  size = "sm",
  className = ""
}) => {
  const variants = {
    default: "bg-gray-800 text-gray-300",
    success: "bg-green-900 text-green-300",
    error: "bg-red-900 text-red-300",
    warning: "bg-yellow-900 text-yellow-300",
    info: "bg-blue-900 text-blue-300",
    connected: "bg-green-900 text-green-300",
    disconnected: "bg-red-900 text-red-300"
  }

  const sizes = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm"
  }

  return (
    <span className={`
      inline-flex items-center font-medium rounded-md
      ${variants[variant] || variants.default}
      ${sizes[size] || sizes.sm}
      ${className}
    `}>
      {children}
    </span>
  )
}