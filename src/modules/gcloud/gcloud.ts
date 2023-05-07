import { LanguageServiceClient } from "@google-cloud/language";
import { SpeechClient } from "@google-cloud/speech";
import { injectable } from "inversify";
import { join } from "path";

@injectable()
export abstract class GCloud {
  protected speechClient: SpeechClient;
  protected languageClient: LanguageServiceClient;
  private credentialsPath: string = join(
    __dirname,
    "../../../keys/kitty-chan-gcloud.json"
  );

  constructor() {
    this.speechClient = new SpeechClient({
      keyFile: this.credentialsPath,
    });

    this.languageClient = new LanguageServiceClient({
      keyFile: this.credentialsPath,
    });
  }
}
