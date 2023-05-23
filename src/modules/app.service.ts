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

    const entity = await this.extractEntity(transcription);

    return {
      rawSpeechText: transcription || "",
      entity,
    };
  }

  /**Using Regex to extract entities and correct common type errors from Google Speech API
   *
   * For Address we may need to use Google NLP API
   */
  async extractEntity(text: string) {
    const query: any = {};

    /**Email Extraction */
    const emailRegex = /email\s+(.*?)\s+at\s+([\w.-]+(?:\.[\w-]+)*)/i;

    const emailMatch = text.match(emailRegex);

    if (emailMatch && emailMatch.length > 0) {
      const value = emailMatch[1]
        .trim()
        .replace(/\s+hyphen\s+/gi, "-")
        .replace(/\s+underscore\s+/gi, "_")
        .replace(/\s/g, "");
      const domain = emailMatch[2].trim();

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
    // const addressExtraction = await this.addressNLPExtraction(text);
    // if (addressExtraction) {
    //   query.ADDRESS1 = addressExtraction;
    // }

    return query;
  }

  async addressNLPExtraction(text: string): Promise<string | null> {
    const entity = await this.languageService.entityAnalysis(text);
    if (!entity || entity.length === 0) {
      return null;
    }

    const addressKey = "address";
    const locationType = "LOCATION";

    // Find the index of the address key in the sentence
    const addressKeyIndex = text.toLowerCase().indexOf(addressKey);

    if (addressKeyIndex === -1) {
      return null; // Address key not found
    }

    // Extract the substring starting from the address key
    const addressSubstr = text
      .substring(addressKeyIndex + addressKey.length)
      .trim();

    console.log(addressSubstr, "Sub string");
    // Find the location entity after the address key
    const locationEntity = entity.find(
      (entity) => entity.type === locationType
    );

    if (!locationEntity) {
      return null; // Location entity not found
    }

    const locationName = locationEntity.name.toLowerCase();
    const locationIndex = addressSubstr.toLowerCase().indexOf(locationName);

    if (locationIndex === -1) {
      return null; // Location entity not found within the address substring
    }

    // Extract the address substring from the start to the location entity's name
    const address = addressSubstr
      .substring(0, locationIndex + locationName.length)
      .trim();

    return address || null;
  }
}
