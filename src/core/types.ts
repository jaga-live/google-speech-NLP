import "reflect-metadata";

/**IOC - Inversify Types */
export const TYPES = {
  /**App Services */
  AppService: Symbol.for("AppService"),

  /**Google Cloud Services */
  GoogleSpeechService: Symbol.for("GoogleSpeechService"),
  GoogleNaturalLanguageService: Symbol.for("GoogleNaturalLanguageService"),
};
