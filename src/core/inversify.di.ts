import "reflect-metadata";
import { Container } from "inversify";
import { GoogleSpeechService } from "../modules/google-speech/google-speech.service";
import { TYPES } from "./types";

const container = new Container({ defaultScope: "Singleton" });

/**Controllers */
import "../app.controller";

/**Service */
container
  .bind<GoogleSpeechService>(TYPES.GoogleSpeechService)
  .to(GoogleSpeechService);

export default container;
