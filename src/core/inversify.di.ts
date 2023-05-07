import "reflect-metadata";
import { Container } from "inversify";
import { GoogleSpeechService } from "../modules/google-speech/google-speech.service";
import { TYPES } from "./types";

const container = new Container({ defaultScope: "Singleton" });

/**Controllers */
import "../app.controller";
import { GoogleNaturalLanguageService } from "../modules/google-nlp/google-nlp.service";

/**Service */
container
  .bind<GoogleSpeechService>(TYPES.GoogleSpeechService)
  .to(GoogleSpeechService);
container
  .bind<GoogleNaturalLanguageService>(TYPES.GoogleNaturalLanguageService)
  .to(GoogleNaturalLanguageService);

export default container;
