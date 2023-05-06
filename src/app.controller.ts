import { inject } from "inversify";
import { controller, httpPost } from "inversify-express-utils";
import { TYPES } from "./core/types";
import { GoogleSpeechService } from "./modules/google-speech/google-speech.service";
import { Request } from "express";
import multer from "multer";

@controller("")
export class AppController {
  constructor(
    @inject(TYPES.GoogleSpeechService)
    private readonly googleSpeech: GoogleSpeechService
  ) {}

  @httpPost("/speech", multer().single("file"))
  async speech(req: Request) {
    const audioBase64 = Buffer.from(req.file.buffer).toString("base64");
    return this.googleSpeech.speechToText(audioBase64);
  }
}
