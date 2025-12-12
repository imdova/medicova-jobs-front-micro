export const SkeletonChatItem = () => {
  return (
    <div className="flex items-start justify-between gap-1 border-b bg-gray-50 p-2 py-3">
      <div className="flex items-center gap-2">
        <div className="h-[40px] w-[40px] animate-pulse rounded-full bg-gray-300" />
        <div>
          <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-300" />
          <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
      <div className="h-3 w-8 animate-pulse rounded bg-gray-200" />
    </div>
  );
};

export const NoUserPlaceholder = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative w-full max-w-md rounded-2xl bg-white/10 p-10 shadow-2xl backdrop-blur-lg">
        <div className="absolute inset-0 rounded-2xl border border-purple-500/30"></div>

        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary to-secondary blur"></div>
            <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-black/70 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v14l-4-4H4a2 2 0 01-2-2V5z" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="mb-4 text-center text-3xl font-bold text-main">
          Select a User
        </h1>
        <p className="mb-6 text-center text-muted-foreground">
          To start chatting, please select a user from the list.
        </p>
      </div>
    </div>
  );
};
