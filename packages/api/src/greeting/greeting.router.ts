import { Injectable } from "@nestjs/common";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createRouter, publicProcedure } from "../trpc";
import { GreetingController } from "./greeting.controller";

@Injectable()
export class GreetingRouter {
  constructor(private readonly greetingController: GreetingController) {}

  create() {
    return createRouter({
      hello: publicProcedure
        .input(
          z.object({
            name: z.string().optional(),
          }),
        )
        .query(({ input }) => {
          try {
            const { name } = input;
            return this.greetingController.greet(name);
          } catch (error) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              cause: error,
            });
          }
        }),
    });
  }
}
