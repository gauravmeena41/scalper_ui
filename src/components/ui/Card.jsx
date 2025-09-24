export const Card = ({
  children,
  className = "",
  title,
  subtitle,
  action,
  padding = "p-6",
  background = "bg-gray-900",
  border = "border border-gray-800"
}) => {
  return (
    <div className={`${background} ${border} rounded-lg ${padding} ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}