CREATE DATABASE `telepapyrus`;

CREATE TABLE `telepapyrus`.`allowed_tags` (
  `tag` varchar(64) NOT NULL,
  PRIMARY KEY (`tag`)
);

INSERT INTO `telepapyrus`.`allowed_tags` VALUES
('test-article-get-success-tag'),
('test-article-list-success-specific-tag'),
("test-article-count-success-specific-tag-1"),
("test-article-count-success-specific-tag-2"),
("test-tag-create-fail-already-exists"),
("test-tag-delete-fail-too-many-rows-deleted-1"),
("test-tag-delete-fail-too-many-rows-deleted-2");

CREATE TABLE `telepapyrus`.`articles` (
  `id` varchar(64) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `content` text NOT NULL,
  `date` datetime(3) NOT NULL,
  `last_updated` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `telepapyrus`.`articles` VALUES
('test-article-create-fail-already-exists', 'title', 'description', 'content', '2024-01-01 00:00:00.000', NULL, true),
('test-article-delete-fail-too-many-deleted-1', 'title', 'description', 'content', '2024-01-01 00:00:00.001', NULL, true),
('test-article-delete-fail-too-many-deleted-2', 'title', 'description', 'content', '2024-01-01 00:00:00.002', NULL, true),
('test-article-get-success', 'title', 'description', 'content', '2024-01-01 00:00:00.003', '2024-01-01 00:00:00.004', false),
('test-article-list-success-specific-tags-1', 'title', 'description', 'content', '2024-01-01 00:00:00.005', NULL, true),
('test-article-list-success-specific-tags-2', 'title', 'description', 'content', '2024-01-01 00:00:00.006', NULL, true),
('test-article-list-success-specific-tags-3', 'title', 'description', 'content', '2024-01-01 00:00:00.007', NULL, true),
('test-article-list-success-unlisted', 'title', 'description', 'content', '2024-01-01 00:00:00.008', NULL, false),
('test-article-update-fail-invalid-tag', 'title', 'description', 'content', '2024-01-01 00:00:00.009', NULL, true),
("test-article-count-success-specific-tags-1", "title", 'description', "content", '2024-01-01 00:00:00.010', NULL, true),
("test-article-count-success-specific-tags-2", "title", 'description', "content", '2024-01-01 00:00:00.011', NULL, true),
("test-article-count-success-specific-tags-3", "title", 'description', "content", '2024-01-01 00:00:00.012', NULL, true);

CREATE TABLE `telepapyrus`.`tags` (
  `id` varchar(64) NOT NULL,
  `tag` varchar(64) NOT NULL,
  PRIMARY KEY (`id`,`tag`),
  KEY `tag_idx` (`tag`),
  CONSTRAINT `id` FOREIGN KEY (`id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tag` FOREIGN KEY (`tag`) REFERENCES `allowed_tags` (`tag`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `telepapyrus`.`tags` VALUES
('test-article-get-success', 'test-article-get-success-tag'),
('test-article-list-success-specific-tags-1', 'test-article-list-success-specific-tag'),
('test-article-list-success-specific-tags-2', 'test-article-list-success-specific-tag'),
('test-article-list-success-specific-tags-3', 'test-article-list-success-specific-tag'),
("test-article-count-success-specific-tags-1", "test-article-count-success-specific-tag-1"),
("test-article-count-success-specific-tags-2", "test-article-count-success-specific-tag-1"),
("test-article-count-success-specific-tags-2", "test-article-count-success-specific-tag-2"),
("test-article-count-success-specific-tags-3", "test-article-count-success-specific-tag-2");


CREATE TABLE `telepapyrus`.`drafts` (
  `id` varchar(64) NOT NULL,
  `title` varchar(128) DEFAULT NULL,
  `content` text DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `telepapyrus`.`drafts` VALUES
("test-draft-create-success-update", "title", "content"),
("test-draft-get-success", "title", "content"),
("test-draft-delete-fail-too-many-deleted-1", "title", "content"),
("test-draft-delete-fail-too-many-deleted-2", "title", "content"),
("test-draft-changeid-fail-too-many-affected-1", "title", "content"),
("test-draft-changeid-fail-too-many-affected-2", "title", "content"),
("test-draft-changeid-fail-already-exists-1", "title", "content"),
("test-draft-changeid-fail-already-exists-2", "title", "content");

CREATE VIEW `telepapyrus`.`pages` AS
select
  `t`.`row_num` DIV 10 + 1 AS `page`,
  `t`.`date` AS `date`
from
  (
    select
      `telepapyrus`.`articles`.`date` AS `date`,
      row_number() over (
        order by
          `telepapyrus`.`articles`.`date` desc
      ) AS `row_num`
    from
      `telepapyrus`.`articles`
    where
      `telepapyrus`.`articles`.`public` = true
  ) `t`
where
  `t`.`row_num` MOD 10 = 1
  or `t`.`date` = (
    select
      max(
        `telepapyrus`.`articles`.`date`
      )
    from
      `telepapyrus`.`articles`
  );