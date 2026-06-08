import { cn } from "@/lib/utils"

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  fluid?: boolean
}

export function Main({
  fixed,
  className,
  fluid,
  ...props
}: MainProps) {
  return (
    <main
      data-layout={fixed ? "fixed" : "auto"}
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-6 px-4 py-6 sm:px-6",
        fixed && "overflow-hidden",
        !fluid && "mx-auto w-full max-w-7xl",
        className,
      )}
      {...props}
    />
  )
}
