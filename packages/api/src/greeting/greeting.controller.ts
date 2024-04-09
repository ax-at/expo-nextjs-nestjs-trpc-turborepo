import { Injectable } from "@nestjs/common";

import type { Logger } from "@acme/logging";
import { LoggerFactory } from "@acme/logging";

import { GreetingService } from "./greeting.service";

@Injectable()
export class GreetingController {
  private readonly logger: Logger =
    LoggerFactory.getLogger("GreetingController");

  constructor(private readonly greetingService: GreetingService) {}

  public greet(name: string | undefined) {
    try {
      return this.greetingService.greet(name);
    } catch (error) {
      this.logger.error(
        error,
        "Unable to perform greeting with the provided name",
      );
      throw error;
    }
  }
}
