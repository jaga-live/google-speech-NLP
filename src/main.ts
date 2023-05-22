import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import container from "./core/inversify.di";
import express from "express";
// import "./modules/tensorflow/tensorflow.service";

class App {
  async bootstrap() {
    const server = new InversifyExpressServer(container);

    ///Express Config
    server.setConfig((app) => {
      app.use(express.json());
    });

    const app = server.build();
    app.listen(5000, () => {
      console.log("Express Server up and running");
    });
  }
}

new App().bootstrap();
