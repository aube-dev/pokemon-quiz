-- Insert sample data (optional)
INSERT INTO "users" ("sn", "username", "total_score") VALUES
    ('USER-001', '테스트유저1', 0),
    ('USER-002', '테스트유저2', 0);

INSERT INTO "problems" ("title", "category", "score", "data") VALUES
    ('이 포켓몬은?', 'Pokemon', 100, '{"imageUrl": "https://example.com/pikachu.png", "options": ["피카츄", "라이츄", "파이리", "꼬부기"], "correctAnswer": 0}'),
    ('이 BGM은?', 'BGM', 150, '{"audioUrl": "https://example.com/bgm.mp3", "options": ["팔레트타운", "상록시티", "회색시티", "갈색시티"], "correctAnswer": 0}');
