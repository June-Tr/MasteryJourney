CREATE DATABASE IF NOT EXISTS MasteryJourney;

USE MasteryJourney;

CREATE TABLE IF NOT EXISTS `main_mastery`(
	`type` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`total_hour` DOUBLE NOT NULL DEFAULT 0.0 ,
	`addDate` DATETIME NOT NULL DEFAULT NOW(),
	`lastUpdate` DATETIME NOT NULL DEFAULT NOW(),
	`label` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`label`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
			ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `subskill` (
	`description` VARCHAR(200) COLLATE 'utf8mb4_general_ci',
	`priority` INT(3) NOT NULL,
	`main_mastery_label` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`label` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	
	PRIMARY KEY (`label`) USING BTREE,
	CONSTRAINT `fk_main_mastery_subskill` 
		FOREIGN KEY (`main_mastery_label`) REFERENCES `main_mastery` (`label`)
			ON DELETE CASCADE
			ON UPDATE CASCADE
)
COLLATE='utf8mb4_general_ci'
			ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `test` (
	`date` DATETIME NOT NULL DEFAULT NOW(),
	`rate` INT(3) NOT NULL DEFAULT -1,
	`description` VARCHAR(200),
	`subskill_label` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	
	PRIMARY KEY (`date`) USING BTREE,
	CONSTRAINT `fk_subskill_test`
		FOREIGN KEY (`subskill_label`) REFERENCES `subskill` (`label`)
			ON DELETE CASCADE
			ON UPDATE CASCADE
)
COLLATE='utf8mb4_general_ci'
			ENGINE=INNODB;
			

CREATE TABLE IF NOT EXISTS `mission` (
	`category` ENUM('occasion', 'schedule', 'special') NOT NULL DEFAULT 'occasion',
	`estimate_duration` TIME NOT NULL DEFAULT '00:40:00',
	`actual_duration` TIME,
	`distract_count` INT NOT NULL DEFAULT 0,
	`due_progression` DOUBLE DEFAULT 50,
	`id` INT NOT NULL,
	
	PRIMARY KEY (`id`) USING HASH
)
COLLATE='utf8mb4_general_ci'
			ENGINE=INNODB;
			
CREATE TABLE IF NOT EXISTS `practise` (
	`contribution` DOUBLE NOT NULL,
	`mission_id` INT NOT NULL,
	`subskill_label` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	
	PRIMARY KEY (`mission_id`, `subskill_label`) USING BTREE,
	CONSTRAINT `fk_mission_subskill`
	FOREIGN KEY (`mission_id`) REFERENCES `mission` (`id`) 
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (`subskill_label`) REFERENCES `subskill` (`label`)
)
COLLATE='utf8mb4_general_ci'
			ENGINE=INNODB;
