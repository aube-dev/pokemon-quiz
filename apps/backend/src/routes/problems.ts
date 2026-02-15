import { FastifyPluginAsync } from 'fastify'
import { ProblemService } from '../services/problemService'
import { CreateProblemDto, SubmitAnswerDto } from '../types/quiz'
import {
    getAllProblemsSchema,
    getProblemByIdSchema,
    createProblemSchema,
    startChallengeSchema,
    submitAnswerSchema,
    giveUpSchema,
} from '../schemas/problemSchema'

const problemRoutes: FastifyPluginAsync = async (server) => {
    const problemService = new ProblemService(server)

    // 모든 문제 조회
    server.get('/problems', {
        onRequest: [server.authenticate],
        schema: getAllProblemsSchema,
    }, async (request, reply) => {
        const problems = await problemService.getAllProblems()

        // category를 tag로 변환하여 반환
        const result = problems.map(p => ({
            number: p.number,
            tag: p.category,
            score: p.score,
        }))

        return reply.send(result)
    })

    // 특정 문제 조회
    server.get<{
        Params: { id: string }
    }>('/problems/:id', {
        onRequest: [server.authenticate],
        schema: getProblemByIdSchema,
    }, async (request, reply) => {
        const { id } = request.params
        const userId = request.user.id

        const problem = await problemService.getProblemById(id, userId)
        return reply.send(problem)
    })

    // 문제 생성
    server.post<{
        Body: CreateProblemDto
    }>('/problems', {
        onRequest: [server.authenticate],
        schema: createProblemSchema,
    }, async (request, reply) => {
        const problem = await problemService.createProblem(request.body)
        return reply.status(201).send(problem)
    })

    // 문제 도전 시작
    server.patch<{
        Params: { number: number }
    }>('/problems/number/:number/challenge', {
        onRequest: [server.authenticate],
        schema: startChallengeSchema,
    }, async (request, reply) => {
        const { number } = request.params
        const userId = request.user.id

        const userProblem = await problemService.startChallenge(userId, number)

        return reply.status(201).send({
            problemId: userProblem.problemId,
            challengedAt: userProblem.challengedAt,
        })
    })

    // 문제 정답 제출
    server.post<{
        Params: { id: string }
        Body: SubmitAnswerDto
    }>('/problems/:id/submit', {
        onRequest: [server.authenticate],
        schema: submitAnswerSchema,
    }, async (request, reply) => {
        const { id: problemId } = request.params
        const userId = request.user.id

        const updatedUserProblem = await problemService.submitAnswer(userId, problemId, request.body)

        return reply.status(200).send(updatedUserProblem)
    })

    // 문제 포기
    server.patch<{
        Params: { id: string }
    }>('/problems/:id/giveup', {
        onRequest: [server.authenticate],
        schema: giveUpSchema,
    }, async (request, reply) => {
        const { id: problemId } = request.params
        const userId = request.user.id

        const updatedUserProblem = await problemService.giveUp(userId, problemId)

        return reply.status(200).send(updatedUserProblem)
    })
}

export default problemRoutes
