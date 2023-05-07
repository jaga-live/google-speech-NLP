import { inject } from "inversify";
import { controller, httpPost } from "inversify-express-utils";
import multer from "multer";
import { Request } from "express";
import { TYPES } from "./core/types";
import { GoogleSpeechService } from "./modules/google-speech/google-speech.service";
import { GoogleNaturalLanguageService } from "./modules/google-nlp/google-nlp.service";

@controller("")
export class AppController {
  constructor(
    @inject(TYPES.GoogleSpeechService)
    private readonly googleSpeech: GoogleSpeechService,
    @inject(TYPES.GoogleNaturalLanguageService)
    private readonly naturalLanguage: GoogleNaturalLanguageService
  ) {}

  @httpPost("/speech", multer().single("file"))
  async speech(req: Request) {
    const audioBase64 = Buffer.from(req.file.buffer).toString("base64");

    return this.googleSpeech.speechToText(audioBase64);
  }

  @httpPost("/entity")
  async language(req: Request) {
    return this.naturalLanguage.entityAnalysis(req.body.query);
  }
}
