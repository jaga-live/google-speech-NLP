import { injectable } from "inversify";
import { GCloud } from "../gcloud/gcloud";

@injectable()
export class GoogleSpeechService extends GCloud {
  async speechToText(audioBase64: string) {
    const audio = {
      content: audioBase64,
    };
    const config = {
      encoding: "MP3",
      sampleRateHertz: 48000,
      languageCode: "en-US",
    };

    const request = {
      audio: audio,
      config: config,
    } as any;

    const [response] = await this.speechClient.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    console.log(`Transcription: ${transcription}`);

    const extractedEntity = await this.extractEntity(transcription);
    console.log(extractedEntity);

    return this.extractEntity(transcription);
  }

  /**Using Regex to extract entities and correct common type errors from Google Speech API
   *
   * For Address we may need to use Google NLP API
   */
  private async extractEntity(text: string) {
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
    return query;

    /**Address - Todo (With Google NLP) */
  }
}
