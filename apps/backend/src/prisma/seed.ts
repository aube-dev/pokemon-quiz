import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Seed Users
    const users = [
        { sn: 'SN-2024-001', username: '피카츄팬' },
        { sn: 'SN-2024-002', username: '로켓단탈주자' },
        { sn: 'SN-2024-003', username: '태초마을박사' },
        { sn: 'SN-2024-004', username: '관동지방여행자' },
        { sn: 'SN-2024-005', username: '포켓몬마스터' },
        { sn: 'SN-2024-006', username: '이브이진화론' },
        { sn: 'SN-2024-007', username: '뮤츠의역습' },
        { sn: 'SN-2024-008', username: '웅이의돌솥비빔밥' },
        { sn: 'SN-2024-009', username: '이슬이의워터파크' },
        { sn: 'SN-2024-010', username: '잠만보침대' },
    ]

    // Clear existing data to avoid conflicts
    await prisma.userProblem.deleteMany()
    await prisma.problem.deleteMany()
    await prisma.user.deleteMany()

    // Seed Users
    for (const u of users) {
        await prisma.user.create({
            data: {
                sn: u.sn,
                username: u.username,
                totalScore: 0,
            },
        })
    }

    // Seed Problems
    const problems = [
        {
            title: '이 포켓몬의 진화형은 누구일까요?',
            category: 'Pokemon',
            score: 100,
            answer: 1,
            content: {
                imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
                options: ['피츄', '라이츄', '파이리', '꼬부기'],
            },
        },
        {
            title: '관동지방의 여덟 번째 체육관 관장인 비주기의 주력 타입은?',
            category: 'Character',
            score: 150,
            answer: 0,
            content: {
                imageUrl: 'https://archives.bulbagarden.net/media/upload/thumb/f/fa/Giovanni_LGPE.png/250px-Giovanni_LGPE.png',
                options: ['땅', '노말', '독', '에스퍼'],
            },
        },
        {
            title: '다음 중 망나뇽의 타입 조합으로 올바른 것은?',
            category: 'Pokemon',
            score: 200,
            answer: 2,
            content: {
                imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png',
                options: ['드래곤/물', '드래곤/불꽃', '드래곤/비행', '드래곤/얼음'],
            },
        },
        {
            title: '가장 많은 진화 루트(8가지)를 가진 포켓몬은?',
            category: 'Pokemon',
            score: 150,
            answer: 3,
            content: {
                imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
                options: ['디그다', '고오스', '잉어킹', '이브이'],
            },
        },
        {
            title: '뮤츠는 어떤 포켓몬의 유전자를 조작하여 만들어졌나?',
            category: 'Story',
            score: 200,
            answer: 0,
            content: {
                imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
                options: ['뮤', '리자몽', '메타몽', '알세우스'],
            },
        },
        {
            title: '다음 중 독 타입을 보유하지 않은 포켓몬은?',
            category: 'Pokemon',
            score: 150,
            answer: 1,
            content: {
                imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
                options: ['팬텀', '푸린', '아보크', '또가스'],
            },
        },
        {
            title: '전설의 새 포켓몬 중 얼음 타입을 가진 포켓몬은?',
            category: 'Pokemon',
            score: 100,
            answer: 2,
            content: {
                imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png',
                options: ['파이어', '썬더', '프리져', '루기아'],
            },
        },
        {
            title: '지우의 영원한 파트너인 피카츄의 포켓몬 도감 번호는?',
            category: 'Pokemon',
            score: 100,
            answer: 0,
            content: {
                imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
                options: ['25번', '1번', '151번', '150번'],
            },
        },
        {
            title: '웅이(Brock)의 주력 포켓몬이자 돌을 먹고 사는 포켓몬은?',
            category: 'Character',
            score: 100,
            answer: 1,
            content: {
                imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png',
                options: ['꼬마돌', '롱스톤', '코뿌리', '뿔카노'],
            },
        },
        {
            title: '다음 중 스타팅 포켓몬이 아닌 것은?',
            category: 'Pokemon',
            score: 150,
            answer: 3,
            content: {
                options: ['파이리', '꼬부기', '이상해씨', '캐터피'],
            },
        },
    ]

    for (const p of problems) {
        await prisma.problem.create({
            data: {
                title: p.title,
                category: p.category,
                score: p.score,
                answer: p.answer,
                content: p.content as any,
            },
        })
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
