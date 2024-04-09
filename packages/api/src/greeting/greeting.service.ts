import { Injectable } from "@nestjs/common";

import type { Logger } from "@acme/logging";
import { LoggerFactory } from "@acme/logging";

@Injectable()
export class GreetingService {
  private readonly logger: Logger = LoggerFactory.getLogger("GreetingService");

  public greet(name: string | undefined) {
    this.logger.info("greet() called");
    return {
      greeting: `Hello ${name ? name : `xxx`}`,
    };
  }
}
