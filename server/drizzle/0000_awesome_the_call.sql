-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `HOSPITAL` (
	`CD_HOSPITAL` integer PRIMARY KEY,
	`NM_HOSPITAL` text NOT NULL,
	`NR_LATITUDE` numeric NOT NULL,
	`NR_LONGITUDE` numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE `MEDICO` (
	`CD_MEDICO` integer PRIMARY KEY,
	`NM_MEDICO` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `CHAMADO` (
	`NR_CHAMADO` integer PRIMARY KEY,
	`CD_HOSPITAL` integer NOT NULL,
	`IE_TIPO_CHAMADO` numeric,
	`NM_PACIENTE` text,
	`IE_SEXO` text,
	`IE_STATUS_CHAMADO` text,
	`CD_MEDICO` integer,
	FOREIGN KEY (`CD_MEDICO`) REFERENCES `MEDICO`(`CD_MEDICO`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`CD_HOSPITAL`) REFERENCES `HOSPITAL`(`CD_HOSPITAL`) ON UPDATE no action ON DELETE no action
);

*/