import { Injectable } from "@nestjs/common";
import { z } from "zod";

import { createRouter, publicProcedure } from "@acme/trpc";
import { CreatePostSchema } from "@acme/validators";

import { PostController } from "./post.controller";

@Injectable()
export class PostRouter {
  constructor(private readonly postController: PostController) {}

  create() {
    return createRouter({
      all: publicProcedure.query(({}) => {
        return this.postController.getAll();
      }),

      byId: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input }) => {
          const id = input.id;
          return this.postController.getById(id);
        }),

      create: publicProcedure.input(CreatePostSchema).mutation(({ input }) => {
        return this.postController.create(input);
      }),

      delete: publicProcedure.input(z.number()).mutation(({ input }) => {
        return this.postController.deleteById(input);
      }),
    });
  }
}
