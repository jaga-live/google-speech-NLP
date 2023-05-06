import { injectable } from "inversify";
import { SpeechClient } from "@google-cloud/speech";
import path from "path";

@injectable()
export class GoogleSpeechService {
  private speechClient: SpeechClient;

  constructor() {
    this.speechClient = new SpeechClient({
      keyFile: path.join(__dirname, "../../../keys/kitty-chan-gcloud.json"),
    });
  }

  async speechToText(audioBase64: string) {
    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
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

    // Detects speech in the audio file
    const [response] = await this.speechClient.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    console.log(`Transcription: ${transcription}`);
  }
}
