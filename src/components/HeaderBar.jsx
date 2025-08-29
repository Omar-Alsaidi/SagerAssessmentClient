function IconButton({ children, badge, ariaLabel }) {
  return (
    <button
      aria-label={ariaLabel}
      className="relative grid place-items-center h-9 w-9 rounded-lg hover:bg-[#1a1a1a] transition-colors"
    >
      {children}
      {badge !== undefined && (
        <span className="absolute -top-0 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-[13px] font-semibold text-white grid place-items-center">
          {badge}
        </span>
      )}
    </button>
  );
}

export default function HeaderBar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between h-14 px-4 md:px-6 bg-black border-b border-[#252525]">
      {/* Left: Brand */}
      <div className="flex items-center">
        <img
          src="/logo.png"
          alt="Sager"
          className="h-6 md:h-7 w-auto select-none"
          draggable="false"
        />
      </div>

      {/* Right: Actions + Profile */}
      <div className="flex items-center gap-1">
        <IconButton ariaLabel="Settings">
          <img src="/capture-svgrepo-com.svg" alt="capture" className="w-6"/>
        </IconButton>

        <IconButton ariaLabel="Change language">
          <img src="/language-svgrepo-com.svg" alt="language" className="w-6"/>
        </IconButton>

        <IconButton ariaLabel="Notifications" badge={8}>
          <img src="/bell.svg" alt="notification" className="w-6"/>
        </IconButton>

        <div className="mx-3 h-6 w-px bg-[#252525]" />

        <button className="flex items-center gap-3 group">
          <div className="text-left leading-tight hidden sm:block">
            <p className="text-xs text-gray-300">
              Hello, <span className="font-medium">Mohammed Omar</span>
            </p>
            <p className="text-[11px] text-gray-400">Technical Support</p>
          </div>
        </button>
      </div>
    </nav>
  );
}
