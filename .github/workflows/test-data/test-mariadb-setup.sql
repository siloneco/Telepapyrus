CREATE DATABASE `telepapyrus`;

CREATE TABLE `telepapyrus`.`allowed_tags` (
  `tag` varchar(32) NOT NULL,
  PRIMARY KEY (`tag`)
);

INSERT INTO `telepapyrus`.`allowed_tags` VALUES
('TestTag1'),
('TestTag2');

CREATE TABLE `telepapyrus`.`articles` (
  `id` varchar(64) NOT NULL,
  `title` text NOT NULL,
  `content` text NOT NULL,
  `date` datetime(3) NOT NULL,
  `last_updated` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `telepapyrus`.`articles` VALUES
('test-1','Test Article 1','## This is test article 1\nFirst Line','2023-08-08 02:30:14.734','2023-08-10 03:42:14.734'),
('test-2','Test Article 2','# This is test article 2\n\nTest code block\n```js:test.js\nconsole.log(\"test\")\n```\n','2023-08-09 02:36:21.179',NULL),
('test-3','Test Article 3','# This is test article 3','2023-08-08 02:36:21.179',NULL),
('test-4','Test Article 4','# This is test article 4','2023-08-12 09:25:11.867',NULL);

CREATE TABLE `telepapyrus`.`tags` (
  `id` varchar(64) NOT NULL,
  `tag` varchar(32) NOT NULL,
  PRIMARY KEY (`id`,`tag`),
  KEY `tag_idx` (`tag`),
  CONSTRAINT `id` FOREIGN KEY (`id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tag` FOREIGN KEY (`tag`) REFERENCES `allowed_tags` (`tag`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `telepapyrus`.`tags` VALUES
('test-1','TestTag1'),
('test-1','TestTag2'),
('test-2','TestTag1'),
('test-3','TestTag2');

CREATE VIEW `telepapyrus`.`pages` AS select `t`.`row_num` DIV 10 + 1 AS `page`,`t`.`date` AS `date` from (select `telepapyrus`.`articles`.`date` AS `date`,row_number() over ( order by `telepapyrus`.`articles`.`date` desc) AS `row_num` from `telepapyrus`.`articles`) `t` where `t`.`row_num` MOD 10 = 1 or `t`.`date` = (select max(`telepapyrus`.`articles`.`date`) from `telepapyrus`.`articles`);
