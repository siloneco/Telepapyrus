export const insertDraftSQL = `
INSERT INTO drafts (id, title, content) VALUES (:id, :title, :content) ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content);
`
