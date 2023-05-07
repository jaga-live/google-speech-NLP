import { GCloud } from "../gcloud/gcloud";

export class GoogleNaturalLanguageService extends GCloud {
  async entityAnalysis(text: string) {
    const document = {
      content: text,
      type: "PLAIN_TEXT",
    } as any;

    const [result] = await this.languageClient.analyzeEntities({ document });
    const entities = result.entities;
    return entities;
  }
}
