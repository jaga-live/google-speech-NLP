import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import container from "./core/inversify.di";
import express from "express";
import cors from "cors";
import path from "path";

class App {
  async bootstrap() {
    const server = new InversifyExpressServer(container);

    ///Express Config
    server.setConfig((app) => {
      app.use(express.json());
      app.use(cors());
    });

    const app = server.build();
    app.listen(5000, () => {
      console.log("Express Server up and running");
    });

    /**Server React App */
    app.use(express.static(path.join(__dirname, "../client/build")));
  }
}

new App().bootstrap();
