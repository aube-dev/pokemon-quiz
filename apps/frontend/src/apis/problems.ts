import { queryKey } from "@/utils/api";
import { api } from "./base";
import { HttpMethod } from "@/constants/api";
import type { ProblemId, ProblemNumber } from "@/types/problems";
import type { QuizBlock } from "@pokemon-quiz/interface";
import type { UserProblemStatus } from "@/constants/userProblems";
import { api_getMe } from "./users";
import { api_getLeaderboard } from './leaderboards'
import type { UserProblemId } from "@/types/userProblems";

export const problemsQueryKey = queryKey("problems");

export const api_getProblems = api.queryApi<
  null,
  {
    number: ProblemNumber;
    tag: string;
    score: number;
  }[]
>({
  method: HttpMethod.GET,
  endpoint: "/api/problems",
  request: () => ({}),
  queryKey: () => problemsQueryKey.add("list").value,
});

export const api_getProblemDetail = api.queryApi<
  {
    id: ProblemId;
  },
  {
    id: ProblemId;
    number: ProblemNumber;
    title: string;
    category: string;
    score: number;
    content: QuizBlock[];
  }
>({
  method: HttpMethod.GET,
  endpoint: (variables) => `/api/problems/${variables.id}`,
  request: () => ({}),
  queryKey: (variables) => problemsQueryKey.add(variables.id).value,
});

export const api_challengeProblem = api.mutationApi<
  { number: ProblemNumber },
  {
    problemId: ProblemId;
    status: UserProblemStatus;
    challengedAt: string;
  }
>({
  method: HttpMethod.PATCH,
  endpoint: (variables) => `/api/problems/${variables.number}/challenge`,
  request: () => ({}),
  mutationKey: problemsQueryKey.add("challenge").value,
  updatesOnSuccess: () => [api_getMe.queryUpdate(null)],
});

export const api_submitProblem = api.mutationApi<
  { id: ProblemId; choice: number },
  {
    id: UserProblemId;
    score: number;
    status: UserProblemStatus;
    submittedAt: string;
  }
>({
  method: HttpMethod.POST,
  endpoint: (variables) => `/api/problems/${variables.id}/submit`,
  request: (variables) => ({
    body: {
      choice: variables.choice,
    },
  }),
  mutationKey: problemsQueryKey.add("submit").value,
  updatesOnSuccess: () => [
    api_getMe.queryUpdate(null),
    api_getLeaderboard.queryUpdate(null),
  ],
});

export const api_giveUpProblem = api.mutationApi<
  { id: ProblemId },
  {
    id: UserProblemId;
    status: UserProblemStatus;
  }
>({
  method: HttpMethod.PATCH,
  endpoint: (variables) => `/api/problems/${variables.id}/giveup`,
  request: () => ({}),
  mutationKey: problemsQueryKey.add("giveup").value,
  updatesOnSuccess: () => [
    api_getMe.queryUpdate(null),
    api_getLeaderboard.queryUpdate(null),
  ],
});
