FROM node:16-alpine
WORKDIR /usr/src/google-speech-nlp
COPY package*.json ./
RUN npm install -g typescript
RUN npm install
COPY . .
RUN tsc
CMD [ "node", "./dist/main.js" ]
EXPOSE 5000
