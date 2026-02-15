import { api_getMe } from "@/apis/users";
import { queryClient } from "@/core/api/tanstackQuery";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/quiz")({
  component: RouteComponent,
  beforeLoad: async () => {
    try {
      await queryClient.fetchQuery({
        ...api_getMe.queryOptions(null),
      });
    } catch (_error) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
