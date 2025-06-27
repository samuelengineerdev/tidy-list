import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    ApiUnauthorizedResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
} from '@nestjs/swagger';

export function ApiDefaultResponses(options?: {
    includeNotFound?: boolean;
    includeConflict?: boolean;
}) {
    return applyDecorators(
        ApiUnauthorizedResponse({
            description: 'Unauthorized.',
            schema: {
                properties: {
                    message: { type: 'string' },
                    errors: { type: 'string' },
                    statusCode: { type: 'number' },
                },
            },
        }),
        options?.includeNotFound
            ? ApiNotFoundResponse({
                description: 'Not found.',
                schema: {
                    properties: {
                        message: { type: 'string' },
                        errors: { type: 'string' },
                        statusCode: { type: 'number' },
                    },
                },
            })
            : (target, key, descriptor) => descriptor,
        options?.includeConflict
            ? ApiConflictResponse({
                description: 'Conflict.',
                schema: {
                    properties: {
                        message: { type: 'string' },
                        errors: { type: 'string' },
                        statusCode: { type: 'number' },
                    },
                },
            })
            : (target, key, descriptor) => descriptor,
        ApiInternalServerErrorResponse({
            description: 'Internal server error.',
            schema: {
                properties: {
                    message: { type: 'string' },
                    errors: { type: 'string' },
                    statusCode: { type: 'number' },
                },
            },
        }),
    );
}
