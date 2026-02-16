import { FastifyInstance } from 'fastify'
import { ChallengeStatus } from '@prisma/client'
import { ERROR_MESSAGES, ERROR_CODES, ENCRYPTION_KEY } from '../constants'
import { decrypt, encrypt } from '../utils/crypto'
import type { CreateProblemDto, SubmitAnswerDto } from '@pokemon-quiz/interface'

export class ProblemService {
    constructor(private server: FastifyInstance) { }

    async getAllProblems(sortBy: 'number' | 'score' = 'number', sortOrder: 'asc' | 'desc' = 'asc') {
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
        })
    }

    async getProblemById(id: string, userId: string) {
        const userProblem = await this.server.prisma.userProblem.findUnique({
            where: {
                userId_problemId: {
                    userId,
                    problemId: id,
                },
            },
        })

        if (userProblem && userProblem.status === ChallengeStatus.GIVEN_UP) {
            throw {
                statusCode: 403,
                message: ERROR_MESSAGES.FORBIDDEN_GIVEN_UP,
                code: ERROR_CODES.PROBLEM_GIVEN_UP
            }
        }

        const problem = await this.server.prisma.problem.findUnique({
            where: { id },
            select: {
                id: true,
                number: true,
                title: true,
                category: true,
                score: true,
                content: true,
                createdAt: true,
                updatedAt: true,
            }
        }).then(d => {
            if (!d) return null
            return {
                ...d,
                title: decrypt(d.title, ENCRYPTION_KEY),
            }
        })

        if (!problem) {
            throw { statusCode: 404, message: ERROR_MESSAGES.PROBLEM_NOT_FOUND }
        }

        return problem
    }

    async createProblem(dto: CreateProblemDto) {
        const lastProblem = await this.server.prisma.problem.findFirst({
            orderBy: { number: 'desc' },
            select: { number: true },
        });

        return this.server.prisma.problem.create({
            data: {
                ...dto,
                number: (lastProblem?.number || 0) + 1,
                title: encrypt(dto.title, ENCRYPTION_KEY),
                content: dto.content as any,
                answer: dto.answer as any,
            },
        })
    }

    async startChallenge(userId: string, problemNumber: number) {
        const problem = await this.server.prisma.problem.findUnique({
            where: { number: problemNumber }
        })

        if (!problem) {
            throw { statusCode: 404, message: ERROR_MESSAGES.PROBLEM_NOT_FOUND }
        }

        const problemId = problem.id

        const existingAttempt = await this.server.prisma.userProblem.findUnique({
            where: {
                userId_problemId: {
                    userId,
                    problemId,
                },
            },
        })

        if (existingAttempt) {
            throw { statusCode: 400, message: ERROR_MESSAGES.ALREADY_ATTEMPTED }
        }

        return this.server.prisma.userProblem.create({
            data: {
                userId,
                problemId,
                status: ChallengeStatus.CHALLENGING,
                score: 0,
                challengedAt: new Date(),
            },
        })
    }

    async submitAnswer(userId: string, problemId: string, dto: SubmitAnswerDto) {
        const { choice } = dto

        const attempt = await this.server.prisma.userProblem.findUnique({
            where: {
                userId_problemId: {
                    userId,
                    problemId,
                },
            },
            include: {
                problem: true,
            }
        })

        if (!attempt) {
            throw { statusCode: 400, message: ERROR_MESSAGES.CHALLENGE_REQUIRED }
        }

        if (attempt.status !== ChallengeStatus.CHALLENGING) {
            throw { statusCode: 400, message: ERROR_MESSAGES.CHALLENGE_ENDED }
        }

        const isCorrect = attempt.problem.answer === choice
        const newStatus: ChallengeStatus = isCorrect ? ChallengeStatus.CORRECT : ChallengeStatus.WRONG
        const earnedScore = isCorrect ? attempt.problem.score : 0

        const updatedUserProblem = await this.server.prisma.userProblem.update({
            where: { id: attempt.id },
            data: {
                status: newStatus,
                score: earnedScore,
                submittedAt: new Date(),
            },
        })

        if (isCorrect) {
            await this.server.prisma.user.update({
                where: { id: userId },
                data: {
                    totalScore: {
                        increment: earnedScore,
                    },
                },
            })
        }

        return {
            ...updatedUserProblem,
            isCorrect
        }
    }

    async giveUp(userId: string, problemId: string) {
        const attempt = await this.server.prisma.userProblem.findUnique({
            where: {
                userId_problemId: {
                    userId,
                    problemId,
                },
            },
        })

        if (!attempt) {
            throw { statusCode: 400, message: ERROR_MESSAGES.CHALLENGE_REQUIRED }
        }

        if (attempt.status !== ChallengeStatus.CHALLENGING) {
            throw { statusCode: 400, message: ERROR_MESSAGES.CHALLENGE_ENDED }
        }

        return this.server.prisma.userProblem.update({
            where: { id: attempt.id },
            data: {
                status: ChallengeStatus.GIVEN_UP,
                submittedAt: new Date(),
            },
        })
    }
}
