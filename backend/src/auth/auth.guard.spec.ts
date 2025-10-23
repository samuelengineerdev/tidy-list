import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({
      secret: 'test-secret',
      signOptions: { expiresIn: '1h' },
    });
    guard = new AuthGuard(jwtService);
  });

  const mockExecutionContext = (headers: Record<string, string> = {}): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
    } as any);

  it('should throw UnauthorizedException if no Authorization header', async () => {
    const context = mockExecutionContext(); // sin headers

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const context = mockExecutionContext({
      authorization: 'Bearer invalid.token',
    });

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should return true and set request.user if token is valid', async () => {
    const payload = { sub: 1, email: 'test@example.com' };
    const token = await jwtService.signAsync(payload);

    const request: any = {
      headers: { authorization: `Bearer ${token}` },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(request.user).toEqual(expect.objectContaining(payload));
  });
});
