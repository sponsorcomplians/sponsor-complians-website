import { useClerk, useUser } from "@clerk/react";
import { trpc } from "@/lib/trpc";
import { useCallback, useMemo } from "react";

export function useAuth() {
  const { isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    enabled: isSignedIn === true,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const state = useMemo(() => ({
    user: meQuery.data ?? null,
    loading: !isLoaded || (isSignedIn === true && meQuery.isLoading),
    error: meQuery.error ?? null,
    isAuthenticated: isSignedIn === true && Boolean(meQuery.data),
  }), [isLoaded, isSignedIn, meQuery.data, meQuery.error, meQuery.isLoading]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
