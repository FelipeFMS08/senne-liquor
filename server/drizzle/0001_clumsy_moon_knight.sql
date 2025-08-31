PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_HOSPITAL` (
	`CD_HOSPITAL` integer PRIMARY KEY NOT NULL,
	`NM_HOSPITAL` text NOT NULL,
	`NR_LATITUDE` numeric NOT NULL,
	`NR_LONGITUDE` numeric NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_HOSPITAL`("CD_HOSPITAL", "NM_HOSPITAL", "NR_LATITUDE", "NR_LONGITUDE") SELECT "CD_HOSPITAL", "NM_HOSPITAL", "NR_LATITUDE", "NR_LONGITUDE" FROM `HOSPITAL`;--> statement-breakpoint
DROP TABLE `HOSPITAL`;--> statement-breakpoint
ALTER TABLE `__new_HOSPITAL` RENAME TO `HOSPITAL`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_MEDICO` (
	`CD_MEDICO` integer PRIMARY KEY NOT NULL,
	`NM_MEDICO` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_MEDICO`("CD_MEDICO", "NM_MEDICO") SELECT "CD_MEDICO", "NM_MEDICO" FROM `MEDICO`;--> statement-breakpoint
DROP TABLE `MEDICO`;--> statement-breakpoint
ALTER TABLE `__new_MEDICO` RENAME TO `MEDICO`;--> statement-breakpoint
CREATE TABLE `__new_CHAMADO` (
	`NR_CHAMADO` integer PRIMARY KEY NOT NULL,
	`CD_HOSPITAL` integer NOT NULL,
	`IE_TIPO_CHAMADO` numeric,
	`NM_PACIENTE` text,
	`IE_SEXO` text,
	`IE_STATUS_CHAMADO` text,
	`CD_MEDICO` integer,
	FOREIGN KEY (`CD_HOSPITAL`) REFERENCES `HOSPITAL`(`CD_HOSPITAL`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`CD_MEDICO`) REFERENCES `MEDICO`(`CD_MEDICO`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_CHAMADO`("NR_CHAMADO", "CD_HOSPITAL", "IE_TIPO_CHAMADO", "NM_PACIENTE", "IE_SEXO", "IE_STATUS_CHAMADO", "CD_MEDICO") SELECT "NR_CHAMADO", "CD_HOSPITAL", "IE_TIPO_CHAMADO", "NM_PACIENTE", "IE_SEXO", "IE_STATUS_CHAMADO", "CD_MEDICO" FROM `CHAMADO`;--> statement-breakpoint
DROP TABLE `CHAMADO`;--> statement-breakpoint
ALTER TABLE `__new_CHAMADO` RENAME TO `CHAMADO`;