import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export const User = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     return request.user;
//   },
// );


/**
 * Extrae el usuario del request HTTP.
 * Si no hay usuario, retorna undefined.
 */
export const userFactory = (data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
};

export const User = createParamDecorator(userFactory);
