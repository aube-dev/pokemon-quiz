-- Realistic Sample Data for Pokemon Quiz

-- Insert 10 realistic users
INSERT INTO "users" ("sn", "username", "total_score") VALUES
    ('SN-2024-001', '피카츄팬', 0),
    ('SN-2024-002', '로켓단탈주자', 0),
    ('SN-2024-003', '태초마을박사', 0),
    ('SN-2024-004', '관동지방여행자', 0),
    ('SN-2024-005', '포켓몬마스터', 0),
    ('SN-2024-006', '이브이진화론', 0),
    ('SN-2024-007', '뮤츠의역습', 0),
    ('SN-2024-008', '웅이의돌솥비빔밥', 0),
    ('SN-2024-009', '이슬이의워터파크', 0),
    ('SN-2024-010', '잠만보침대', 0);

-- Insert 10 realistic problems
INSERT INTO "problems" ("title", "category", "score", "answer", "data") VALUES
    ('이 포켓몬의 진화형은 누구일까요?', 'Pokemon', 100, 1, '{"imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", "options": ["피츄", "라이츄", "파이리", "꼬부기"]}'),
    ('관동지방의 여덟 번째 체육관 관장인 비주기의 주력 타입은?', 'Character', 150, 0, '{"imageUrl": "https://archives.bulbagarden.net/media/upload/thumb/f/fa/Giovanni_LGPE.png/250px-Giovanni_LGPE.png", "options": ["땅", "노말", "독", "에스퍼"]}'),
    ('다음 중 망나뇽의 타입 조합으로 올바른 것은?', 'Pokemon', 200, 2, '{"imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png", "options": ["드래곤/물", "드래곤/불꽃", "드래곤/비행", "드래곤/얼음"]}'),
    ('가장 많은 진화 루트(8가지)를 가진 포켓몬은?', 'Pokemon', 150, 3, '{"imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png", "options": ["디그다", "고오스", "잉어킹", "이브이"]}'),
    ('뮤츠는 어떤 포켓몬의 유전자를 조작하여 만들어졌나?', 'Story', 200, 0, '{"imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png", "options": ["뮤", "리자몽", "메타몽", "알세우스"]}'),
    ('다음 중 독 타입을 보유하지 않은 포켓몬은?', 'Pokemon', 150, 1, '{"imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png", "options": ["팬텀", "푸린", "아보크", "또가스"]}'),
    ('전설의 새 포켓몬 중 얼음 타입을 가진 포켓몬은?', 'Pokemon', 100, 2, '{"imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png", "options": ["파이어", "썬더", "프리져", "루기아"]}'),
    ('지우의 영원한 파트너인 피카츄의 포켓몬 도감 번호는?', 'Pokemon', 100, 0, '{"imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", "options": ["25번", "1번", "151번", "150번"]}'),
    ('웅이(Brock)의 주력 포켓몬이자 돌을 먹고 사는 포켓몬은?', 'Character', 100, 1, '{"imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png", "options": ["꼬마돌", "롱스톤", "코뿌리", "뿔카노"]}'),
    ('다음 중 스타팅 포켓몬이 아닌 것은?', 'Pokemon', 150, 3, '{"options": ["파이리", "꼬부기", "이상해씨", "캐터피"]}');
