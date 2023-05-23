import { inject, injectable } from "inversify";
import { TYPES } from "../core/types";
import { GoogleSpeechService } from "./google-speech/google-speech.service";
import { GoogleNaturalLanguageService } from "./google-nlp/google-nlp.service";

@injectable()
export class AppService {
  constructor(
    @inject(TYPES.GoogleSpeechService)
    private readonly speechService: GoogleSpeechService,
    @inject(TYPES.GoogleNaturalLanguageService)
    private readonly languageService: GoogleNaturalLanguageService
  ) {}

  async voiceSearch(audioBase64: string) {
    /**Convert Speech to Text */
    const transcription = await this.speechService.speechToText(audioBase64);
    if (!transcription) {
      return {};
    }

    return this.extractEntity(transcription);
  }

  /**Using Regex to extract entities and correct common type errors from Google Speech API
   *
   * For Address we may need to use Google NLP API
   */
  async extractEntity(text: string) {
    const query: any = {};

    /**Email Extraction */
    const emailRegex =
      /(?<=email\s+)([A-Za-z0-9\s]+(\.\s+)?)+at\s+([A-Za-z0-9.-]+\.[A-Za-z]{2,})/gi;

    const emailMatch = text.match(emailRegex);

    if (emailMatch && emailMatch.length > 0) {
      const parts = emailMatch[0].split(" at ");
      const value = parts[0]
        .trim()
        .replace(/\s+hyphen\s+/gi, "-")
        .replace(/\s+underscore\s+/gi, "_")
        .replace(/\s/g, "");
      const domain = parts[1].trim();
      query.email = `${value.toLowerCase()}@${domain.toLowerCase()}`;
    }

    /**Phone extraction */
    const phoneRegex = /(?<=phone\s+)([\d\s]+[\d])/gi;
    const phoneMatch = text.match(phoneRegex);

    if (phoneMatch && phoneMatch.length > 0) {
      const phoneNumber = phoneMatch[0].replace(/\s/g, "");
      query.phone = phoneNumber;
    }

    /**SSN extraction */
    const ssnRegex = /(?<=ssn|ssin\s+)([\d\s]+[\d])/gi;
    const ssnMatch = text.match(ssnRegex);

    if (ssnMatch && ssnMatch.length > 0) {
      const ssnNumber = ssnMatch[0].replace(/\s/g, "");
      query.SSN = ssnNumber;
    }

    /**MRN extraction */
    const mrnRegex = /(?<=mrn|m r n\s+)([\d\s]+[\d])/gi;
    const mrnMatch = text.match(mrnRegex);

    if (mrnMatch && mrnMatch.length > 0) {
      const mrnNumber = mrnMatch[0].replace(/\s/g, "");
      query.MRN = mrnNumber;
    }

    /**Address*/
    const addressExtraction = await this.addressNLPExtraction(text);
    if (addressExtraction) {
      query.ADDRESS1 = addressExtraction;
    }

    return query;
  }

  async addressNLPExtraction(text: string): Promise<string | null> {
    return null;
  }
}
