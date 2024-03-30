const http = require('http');
const fs = require('fs');
const path = require('path');

module.exports = (api) => {
  api.registerAccessory('TemperatureSensorLogger', TemperatureSensorLogger);
};

class TemperatureSensorLogger {
  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;
    this.debug = config.debug || false;
    this.shouldSanitiseNumber = config.shouldSanitiseNumber || false;

    this.dataPath = config.dataPath ? path.resolve(config.dataPath) : path.join(__dirname, '..', 'data');

    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }

    this.logInfo(`Plugin initialized. Debug mode is ${this.debug ? 'on' : 'off'}.`);
    this.startHttpServer();
  }

  logInfo(message) {
    if (this.debug) {
      this.log.info(message);
    }
  }

  startHttpServer() {
    const port = this.config.port || 8080;

    http.createServer((req, res) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            this.logInfo(`Received data: ${JSON.stringify(data)}`);

            if (!data || typeof data.id === 'undefined' || typeof data.temperature === 'undefined') {
              throw new Error("Missing 'id' or 'temperature' in request body.");
            }

            let temperature = data.temperature.toString();

            if (this.shouldSanitiseNumber) {
              let sanitizedTemperature = temperature
                ?.replace(',','.')
                ?.match(/-?\d+(\.\d+)?/);
              if (!sanitizedTemperature) {
                throw new Error("Temperature data is not a valid number.");
              }
              temperature = sanitizedTemperature[0];
            }

            const sensorId = data.id.toString();
            const filePath = path.join(this.dataPath, `${sensorId}.txt`);

            fs.writeFile(filePath, temperature, (err) => {
              if (err) {
                this.log.error(`Error writing the file for sensor ${sensorId}:`, err);
                res.writeHead(500);
                res.end('Internal Server Error');
                return;
              }
              this.log.info(`Data for sensor ${sensorId} logged successfully: ${temperature}`);
              res.writeHead(200);
              res.end('Data logged');
            });
          } catch (error) {
            this.log.error('Error parsing JSON:', error);
            res.writeHead(400);
            res.end('Bad Request');
          }
        });
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    }).listen(port, () => {
      this.log.info(`TemperatureSensorLogger HTTP Server is running on port ${port}`);
    });
  }

  getServices() {
    return [];
  }
}
