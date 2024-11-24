function TopBar({ children }: React.PropsWithChildren) {
  return (
    <div className="relative z-[51] flex h-[67px] items-center justify-between border-b border-slate-200">
      {children}
    </div>
  )
}

export default TopBar
