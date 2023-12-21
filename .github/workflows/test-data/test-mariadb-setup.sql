CREATE DATABASE `telepapyrus`;

CREATE TABLE `telepapyrus`.`allowed_tags` (
  `tag` varchar(64) NOT NULL,
  PRIMARY KEY (`tag`)
);

INSERT INTO `telepapyrus`.`allowed_tags` VALUES
('test-get-success-tag'),
('test-list-success-specific-tag');

CREATE TABLE `telepapyrus`.`articles` (
  `id` varchar(64) NOT NULL,
  `title` text NOT NULL,
  `content` text NOT NULL,
  `date` datetime(3) NOT NULL,
  `last_updated` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `telepapyrus`.`articles` VALUES
('test-create-fail-already-exists', 'title', 'content', '2024-01-01 00:00:00.000', NULL),
('test-delete-fail-too-many-deleted-1', 'title', 'content', '2024-01-01 00:00:00.001', NULL),
('test-delete-fail-too-many-deleted-2', 'title', 'content', '2024-01-01 00:00:00.002', NULL),
('test-get-success', 'title', 'content', '2024-01-01 00:00:00.003', '2024-01-01 00:00:00.004'),
('test-list-success-specific-tags-1', 'title', 'content', '2024-01-01 00:00:00.005', NULL),
('test-list-success-specific-tags-2', 'title', 'content', '2024-01-01 00:00:00.006', NULL),
('test-list-success-specific-tags-3', 'title', 'content', '2024-01-01 00:00:00.007', NULL),
('test-update-fail-invalid-tag', 'title', 'content', '2024-01-01 00:00:00.008', NULL);

CREATE TABLE `telepapyrus`.`tags` (
  `id` varchar(64) NOT NULL,
  `tag` varchar(64) NOT NULL,
  PRIMARY KEY (`id`,`tag`),
  KEY `tag_idx` (`tag`),
  CONSTRAINT `id` FOREIGN KEY (`id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tag` FOREIGN KEY (`tag`) REFERENCES `allowed_tags` (`tag`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `telepapyrus`.`tags` VALUES
('test-get-success', 'test-get-success-tag'),
('test-list-success-specific-tags-1', 'test-list-success-specific-tag'),
('test-list-success-specific-tags-2', 'test-list-success-specific-tag'),
('test-list-success-specific-tags-3', 'test-list-success-specific-tag');


CREATE TABLE `telepapyrus`.`drafts` (
  `id` varchar(64) NOT NULL,
  `title` varchar(128) DEFAULT NULL,
  `content` text DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `telepapyrus`.`drafts` VALUES
('test-draft-1','Test Draft 1','# This is test draft 1'),
('test-draft-2','Test Draft 2','# This is test draft 2');

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