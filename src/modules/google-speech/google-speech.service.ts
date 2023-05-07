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
      sampleRateHertz: 16000,
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
  }
}
