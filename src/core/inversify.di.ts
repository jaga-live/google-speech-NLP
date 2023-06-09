import "reflect-metadata";
import { Container } from "inversify";
import { GoogleSpeechService } from "../modules/google-speech/google-speech.service";
import { TYPES } from "./types";

const container = new Container({ defaultScope: "Singleton" });

/**Controllers */
import "../app.controller";
import { GoogleNaturalLanguageService } from "../modules/google-nlp/google-nlp.service";
import { AppService } from "../modules/app.service";

/**Service */
container.bind<AppService>(TYPES.AppService).to(AppService);
container
  .bind<GoogleSpeechService>(TYPES.GoogleSpeechService)
  .to(GoogleSpeechService);
container
  .bind<GoogleNaturalLanguageService>(TYPES.GoogleNaturalLanguageService)
  .to(GoogleNaturalLanguageService);

export default container;
