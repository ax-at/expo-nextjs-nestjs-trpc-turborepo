import { Injectable } from "@nestjs/common";

import { GreetingRouter, PostRouter } from "@acme/features";
import { createRouter } from "@acme/trpc";

@Injectable()
export class AppRouterFactory {
  constructor(
    private readonly greetingRouter: GreetingRouter,
    private readonly postRouter: PostRouter,
  ) {}

  create() {
    return createRouter({
      greeting: this.greetingRouter.create(),
      post: this.postRouter.create(),
    });
  }
}

export type AppRouter = ReturnType<AppRouterFactory["create"]>;
