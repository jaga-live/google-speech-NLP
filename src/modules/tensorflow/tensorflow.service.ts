// import * as tf from "@tensorflow/tfjs-node";
// import * as url from "url";
// import { resolve } from "path";

// const modelPath = resolve(__dirname, "../../models/model.json");
// const modelUrl = url.pathToFileURL(modelPath).href;

// const trainingData = [
//   {
//     input: "find email adam@gmail.com",
//     output: {
//       EMAIL: "adam@gmail.com",
//     },
//   },
//   {
//     input: "find email adam at gmail.com",
//     output: {
//       EMAIL: "adam@gmail.com",
//     },
//   },
//   {
//     input: "find email adam@gmail.com and SSN 12345",
//     output: {
//       EMAIL: "adam@gmail.com",
//       SSN: "12345",
//     },
//   },
//   {
//     input: "look for email adam@gmail.com SSN 12345 and also MRN 54321",
//     output: {
//       EMAIL: "adam@gmail.com",
//       SSN: "12345",
//       MRN: "54321",
//     },
//   },
//   {
//     input: "look for email adam at gmail.com ssin 12345 and also mrin 54321",
//     output: {
//       EMAIL: "adam@gmail.com",
//       SSN: "12345",
//       MRN: "54321",
//     },
//   },
// ];

// class FieldExtractor {
//   private model: tf.LayersModel;

//   constructor(model: tf.LayersModel) {
//     this.model = model;
//   }

//   trainModel(xTrain: tf.Tensor, yTrain: tf.Tensor) {
//     const batchSize = 32;
//     const numEpochs = 10;

//     this.model.compile({
//       optimizer: "adam",
//       loss: "categoricalCrossentropy",
//       metrics: ["accuracy"],
//     });

//     return this.model.fit(xTrain, yTrain, { batchSize, epochs: numEpochs });
//   }

//   saveModel(path: string) {
//     return this.model.save(path);
//   }

//   loadModel(path: string) {
//     return tf.loadLayersModel(path);
//   }

//   extractFields(input: string): { [key: string]: string } {
//     // Perform preprocessing on the input, if necessary
//     const processedInput = this.preprocessInput(input);

//     // Perform inference on the preprocessed input
//     const predictions = this.model.predict(processedInput) as any;

//     // Process the predictions and extract the fields
//     const extractedFields = this.processPredictions(predictions);

//     return extractedFields;
//   }

//   private preprocessInput(input: string): tf.Tensor {
//     const inputTensor = tf.tensor2d([[1, 2, 3, 4, 5]]); // Replace with your preprocessing logic
//     return inputTensor;
//   }

//   private processPredictions(predictions: tf.Tensor): {
//     [key: string]: string;
//   } {
//     const extractedFields = {
//       EMAIL: "adam@gmail.com",
//       SSN: "12345",
//       MRN: "54321",
//     };

//     return extractedFields;
//   }
// }

// // Usage example:
// async function test() {
//   // Load the trained model
//   const model = await tf.loadLayersModel(modelUrl);

//   // Create an instance of the FieldExtractor class
//   const fieldExtractor = new FieldExtractor(model);

//   // Train the model
//   const xTrain = tf.tensor2d(
//     trainingData.map((example) =>
//       example.input.split(" ").map((word) => word.toLowerCase())
//     )
//   );
//   const yTrain = tf.tensor2d(
//     trainingData.map((example) => Object.values(example.output))
//   );

//   fieldExtractor
//     .trainModel(xTrain, yTrain)
//     .then(() => {
//       // Save the trained model
//       const savePath = modelUrl;
//       return fieldExtractor.saveModel(savePath);
//     })
//     .then(() => {
//       // Load the trained model
//       const loadPath = modelUrl;
//       return fieldExtractor.loadModel(loadPath);
//     })
//     .then((model) => {
//       // Use the loaded model for field extraction
//       const fieldExtractor = new FieldExtractor(model);

//       // Perform field extraction on new input
//       const input =
//         "look for email adam at gmail.com ssin 12345 and also mrin 54321";
//       const extractedFields = fieldExtractor.extractFields(input);

//       console.log(extractedFields);
//     })
//     .catch((error) => {
//       console.error("An error occurred:", error);
//     });
// }

// test();
