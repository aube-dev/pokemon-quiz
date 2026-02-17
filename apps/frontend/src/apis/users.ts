import { queryKey } from "@/utils/api";
import { api } from "./base";
import { HttpMethod } from "@/constants/api";
import type { UserId } from "@/types/users";
import type { ProblemNumber } from "@/types/problems";
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
      challengedAt: string;
      problem: {
        number: ProblemNumber;
      };
      score: number;
      status: UserProblemStatus;
      submittedAt: string | null;
    }[];
  }
>({
  method: HttpMethod.GET,
  endpoint: "/api/users/me",
  request: () => ({}),
  queryKey: () => usersQueryKey.add("me").value,
});
