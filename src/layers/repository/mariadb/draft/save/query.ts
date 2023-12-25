export const insertDraftSQL = `
INSERT INTO drafts (id, title, content) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content);
`
