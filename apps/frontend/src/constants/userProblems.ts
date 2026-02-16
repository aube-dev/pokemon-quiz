export const UserProblemStatus = {
  CHALLENGING: "CHALLENGING",
  CORRECT: "CORRECT",
  WRONG: "WRONG",
  GIVEN_UP: "GIVEN_UP",
} as const;
export type UserProblemStatus =
  (typeof UserProblemStatus)[keyof typeof UserProblemStatus];
