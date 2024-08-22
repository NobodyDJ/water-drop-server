import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Boolean, { description: '删除一个用户' })
  async sendCodeMsg(@Args('id') id: string): Promise<string> {
    return await this.authService.sendCodeMsg(id);
  }
}
