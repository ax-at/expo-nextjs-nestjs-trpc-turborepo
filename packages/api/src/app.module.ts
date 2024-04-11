import { Module } from "@nestjs/common";
import { AppContextFactory } from "app.context";

import { GreetingModule, PostModule } from "@acme/features";

import { AppRouterFactory } from "./app.router";

@Module({
  imports: [GreetingModule, PostModule],
  controllers: [],
  providers: [AppRouterFactory, AppContextFactory],
  exports: [AppRouterFactory, AppContextFactory],
})
export class AppModule {}
