import { Module } from "@nestjs/common";
import { AppContextFactory } from "app.context";

import { AppRouterFactory } from "./app.router";
import { GreetingModule } from "./greeting";
import { PostModule } from "./post";

@Module({
  imports: [GreetingModule, PostModule],
  controllers: [],
  providers: [AppRouterFactory, AppContextFactory],
  exports: [AppRouterFactory, AppContextFactory],
})
export class AppModule {}
