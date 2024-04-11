import { Injectable } from "@nestjs/common";

import { GreetingRouter, PostRouter } from "@acme/features";
import { mergeRouters } from "@acme/trpc";

@Injectable()
export class AppRouterFactory {
  constructor(
    private readonly greetingRouter: GreetingRouter,
    private readonly postRouter: PostRouter,
  ) {}

  create() {
    return mergeRouters(this.greetingRouter.create(), this.postRouter.create());
  }
}

export type AppRouter = ReturnType<AppRouterFactory["create"]>;
