// src/auth/user.decorator.spec.ts
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { userFactory } from './user.decorator';

describe('User Decorator', () => {
  it('should return user from request', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockRequest = { user: mockUser };
    const context = new ExecutionContextHost([mockRequest, {}, {}]);

    const result = userFactory(null, context);
    expect(result).toEqual(mockUser);
  });

  it('should return undefined if no user in request', () => {
    const mockRequest = {}; // No user
    const context = new ExecutionContextHost([mockRequest, {}, {}]);

    const result = userFactory(null, context);
    expect(result).toBeUndefined();
  });
});
