const variants = {
  primary: "bg-rosegold text-white hover:bg-rosegold-dark",
  outline: "border border-rosegold text-rosegold hover:bg-blush",
  ghost: "text-ink hover:bg-blush",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  as: As = "button",
  ...props
}) {
  return (
    <As
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </As>
  );
}
