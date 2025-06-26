// src/common/decorators/swagger-default-responses.decorator.ts
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
            description: 'No autorizado.',
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
                description: 'No encontrado.',
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
                description: 'Conflicto.',
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
            description: 'Error interno del servidor.',
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
