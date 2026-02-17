import { FastifyInstance } from "fastify";
import { ChallengeStatus } from "@prisma/client";
import type {
  CreateProblemDto,
  SubmitAnswerDto,
  QuizAnswer,
} from "@pokemon-quiz/interface";
import { ENCRYPTION_KEY } from "../constants";
import { decrypt, encrypt } from "../utils/crypto";
import {
  AlreadyAttempted,
  ChallengeEnded,
  ChallengeRequired,
  ForbiddenGivenUp,
  ProblemNotFound,
} from "../errors";

export class ProblemService {
  constructor(private server: FastifyInstance) { }

  async getAllProblems(
    sortBy: "number" | "score" = "number",
    sortOrder: "asc" | "desc" = "asc",
  ) {
    return this.server.prisma.problem.findMany({
      select: {
        number: true,
        title: true,
        category: true,
        score: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  async getProblemById(id: string, userId: string) {
    const userProblem = await this.server.prisma.userProblem.findUnique({
      where: {
        userId_problemId: {
          userId,
          problemId: id,
        },
      },
    });

    if (userProblem && userProblem.status === ChallengeStatus.GIVEN_UP)
      throw new ForbiddenGivenUp();

    const problem = await this.server.prisma.problem
      .findUnique({
        where: { id },
        select: {
          id: true,
          number: true,
          title: true,
          category: true,
          score: true,
          content: true,
          answer: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .then((d) => {
        if (!d) return null;
        return {
          ...d,
          title: decrypt(d.title, ENCRYPTION_KEY),
        };
      });

    if (!problem) {
      throw new ProblemNotFound();
    }

    return problem;
  }

  async createProblem(dto: CreateProblemDto) {
    const lastProblem = await this.server.prisma.problem.findFirst({
      orderBy: { number: "desc" },
      select: { number: true },
    });

    return this.server.prisma.problem.create({
      data: {
        ...dto,
        number: (lastProblem?.number || 0) + 1,
        title: encrypt(dto.title, ENCRYPTION_KEY),
        score: 100,
        content: dto.content as any,
        answer: dto.answer as any,
      },
    });
  }

  async startChallenge(userId: string, problemNumber: number) {
    const problem = await this.server.prisma.problem.findUnique({
      where: { number: problemNumber },
    });

    if (!problem) throw new ProblemNotFound();

    const problemId = problem.id;

    const existingAttempt = await this.server.prisma.userProblem.findUnique({
      where: {
        userId_problemId: {
          userId,
          problemId,
        },
      },
    });

    if (existingAttempt) throw new AlreadyAttempted();

    return this.server.prisma.userProblem.create({
      data: {
        userId,
        problemId,
        status: ChallengeStatus.CHALLENGING,
        score: 0,
        challengedAt: new Date(),
      },
    });
  }

  async submitAnswer(userId: string, problemId: string, dto: SubmitAnswerDto) {
    const { choice } = dto;

    const attempt = await this.server.prisma.userProblem.findUnique({
      where: { userId_problemId: { userId, problemId } },
      include: { problem: true },
    });

    if (!attempt) throw new ChallengeRequired();
    if (attempt.status !== ChallengeStatus.CHALLENGING) throw new ChallengeEnded();

    const isCorrect = (attempt.problem.answer as unknown as QuizAnswer)?.correct === choice
    const newStatus = isCorrect ? ChallengeStatus.CORRECT : ChallengeStatus.WRONG;

    const result = await this.server.prisma.$transaction(async (tx) => {
      const solverCount = await tx.userProblem.count({
        where: {
          problemId: attempt.problemId,
          status: ChallengeStatus.CORRECT,
        },
      });

      const earnedScore = isCorrect
        ? Math.round(attempt.problem.score * Math.max(0.3, 1 - solverCount / 100))
        : 0;

      const updatedUserProblem = await tx.userProblem.update({
        where: { id: attempt.id },
        data: {
          status: newStatus,
          submittedAt: new Date(),
          ...(isCorrect && { score: earnedScore }),
        },
      });

      await tx.problem.update({
        where: { id: problemId },
        data: {
          score: earnedScore
        }
      })

      if (isCorrect) {
        await tx.user.update({
          where: { id: userId },
          data: { totalScore: { increment: earnedScore } },
        });
      }

      return updatedUserProblem;
    });

    return { ...result, isCorrect };
  }

  async giveUp(userId: string, problemId: string) {
    const attempt = await this.server.prisma.userProblem.findUnique({
      where: {
        userId_problemId: {
          userId,
          problemId,
        },
      },
    });

    if (!attempt) {
      throw new ChallengeRequired();
    }

    if (attempt.status !== ChallengeStatus.CHALLENGING) {
      throw new ChallengeEnded();
    }

    return this.server.prisma.userProblem.update({
      where: { id: attempt.id },
      data: {
        status: ChallengeStatus.GIVEN_UP,
        submittedAt: new Date(),
      },
    });
  }
}
