import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import {
  HelpContactSubmissionCreateInput,
  HelpContactSubmissionImageResponse,
  HelpContactSubmissionResponse,
  IHelpContactSubmissionsRepository,
} from '../entities/help-contact-submissions.repository.interface';

@Injectable()
export class HelpContactSubmissionsRepository implements IHelpContactSubmissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: HelpContactSubmissionCreateInput): Promise<HelpContactSubmissionResponse> {
    const submissionId = randomUUID();
    const now = new Date();
    const imageIds = [...new Set(data.image_ids ?? [])];

    return this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        INSERT INTO "help_contact_submissions" (
          "id",
          "user_id",
          "contact_name",
          "contact_email",
          "contact_phone",
          "subject",
          "message",
          "source",
          "metadata",
          "created_at",
          "updated_at"
        )
        VALUES (
          ${submissionId},
          ${data.user_id ?? null},
          ${data.contact_name ?? null},
          ${data.contact_email ?? null},
          ${data.contact_phone ?? null},
          ${data.subject},
          ${data.message},
          ${'help_contact'},
          ${null},
          ${now},
          ${now}
        )
      `;

      await Promise.all(
        imageIds.map(
          (imageId) =>
            tx.$executeRaw`
            INSERT INTO "help_contact_submission_images" (
              "id",
              "submission_id",
              "image_id",
              "created_at"
            )
            VALUES (${randomUUID()}, ${submissionId}, ${imageId}, ${now})
          `,
        ),
      );

      const [submission] = await tx.$queryRaw<HelpContactSubmissionResponse[]>`
        SELECT
          "id",
          "user_id",
          "contact_name",
          "contact_email",
          "contact_phone",
          "subject",
          "message",
          "status",
          "source",
          "metadata",
          "created_at",
          "updated_at",
          "resolved_at"
        FROM "help_contact_submissions"
        WHERE "id" = ${submissionId}
      `;

      const attachments = await tx.$queryRaw<HelpContactSubmissionImageResponse[]>`
        SELECT
          "images"."id",
          "images"."url",
          "images"."public_id",
          "images"."width",
          "images"."height",
          "images"."format",
          "images"."bytes"
        FROM "help_contact_submission_images"
        INNER JOIN "images" ON "images"."id" = "help_contact_submission_images"."image_id"
        WHERE "help_contact_submission_images"."submission_id" = ${submissionId}
      `;

      return {
        ...submission,
        attachments,
      };
    });
  }
}
