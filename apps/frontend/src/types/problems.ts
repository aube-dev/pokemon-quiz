import type { Branded } from "./utils";

export type ProblemId = Branded<string, "problemId">;

export type ProblemNumber = Branded<number, "problemNumber">;
