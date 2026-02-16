import { queryKey } from "@/utils/api";
import { api } from "./base";
import type { UserId } from "@/types/users";
import { HttpMethod } from "@/constants/api";

export const leaderboardsQueryKey = queryKey("leaderboards");

export const api_getLeaderboard = api.queryApi<
  null,
  {
    id: UserId;
    sn: string;
    username: string | null;
    totalScore: number;
  }[]
>({
  method: HttpMethod.GET,
  endpoint: "/api/leaderboard",
  request: () => ({}),
  queryKey: () => leaderboardsQueryKey.add("leaderboard").value,
});
