import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDrama1793679035307 implements MigrationInterface {
    name = 'CreateDrama1793679035307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "drama" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "genre" character varying NOT NULL, "watched" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8b981431953bc6636df3d7d6174" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "drama"`);
    }

}
