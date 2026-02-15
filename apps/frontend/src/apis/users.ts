import { queryKey } from "@/utils/api";
import { api } from "./base";
import { HttpMethod } from "@/constants/api";
import type { UserId } from "@/types/users";
import type { UserProblemId } from "@/types/userProblems";
import type { ProblemId } from "@/types/problems";
import type { UserProblemStatus } from "@/constants/userProblems";

export const usersQueryKey = queryKey("users");

export const api_login = api.mutationApi<
  { sn: string; username: string },
  {
    id: UserId;
    sn: string;
    username: string | null;
    totalScore: number;
    createdAt: string;
    updatedAt: string;
  }
>({
  method: HttpMethod.POST,
  endpoint: "/api/users/login",
  request: (variables) => ({
    body: {
      sn: variables.sn,
      username: variables.username,
    },
  }),
  mutationKey: usersQueryKey.add("login").value,
});

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
  endpoint: "/api/users/leaderboard",
  request: () => ({}),
  queryKey: () => usersQueryKey.add("leaderboard").value,
});

export const api_getMe = api.queryApi<
  null,
  {
    id: UserId;
    sn: string;
    username: string | null;
    totalScore: number;
    createdAt: string;
    updatedAt: string;
    userProblems: {
      id: UserProblemId;
      userId: UserId;
      problemId: ProblemId;
      status: UserProblemStatus;
      score: number;
      challengedAt: string | null;
      submittedAt: string | null;
      problem: {
        id: ProblemId;
        number: number;
        title: string;
        category: string;
        score: number;
      };
    }[];
  }
>({
  method: HttpMethod.GET,
  endpoint: "/api/users/me",
  request: () => ({}),
  queryKey: () => usersQueryKey.add("me").value,
});
