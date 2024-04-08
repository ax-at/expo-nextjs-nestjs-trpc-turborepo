import { Module } from "@nestjs/common";

import { PostController } from "./post.controller";
import { PostRouter } from "./post.router";
import { PostService } from "./post.service";

@Module({
  imports: [],
  controllers: [],
  providers: [PostRouter, PostController, PostService],
  exports: [PostRouter],
})
export class PostModule {}
