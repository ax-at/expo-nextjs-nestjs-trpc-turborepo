import { Injectable } from "@nestjs/common";

import { GreetingRouter } from "./greeting";
import { PostRouter } from "./post";
import { createRouter } from "./trpc";

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
