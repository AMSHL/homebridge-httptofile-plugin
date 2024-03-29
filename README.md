# Homebridge HTTP-to-File Temperature Logger

This Homebridge plugin enables temperature sensors that can make HTTP requests to log their data directly to files on your Homebridge server. It's particularly useful for integrating simple, network-capable temperature sensors with Homebridge without the need for custom accessory plugins for each sensor type.

## Features

- **HTTP Endpoint**: Exposes an HTTP endpoint for temperature sensors to send data.
- **File Logging**: Logs temperature readings from each sensor to individual files.
- **Configurable**: Allows for custom port and file storage path settings.
- **Data Sanitization**: Optionally sanitizes incoming temperature data to extract numerical values.
- **Debug Mode**: Provides detailed logging for troubleshooting.

## Installation

First, ensure you have Homebridge installed. If not, visit [Homebridge](https://github.com/homebridge/homebridge) for installation instructions.

Then, install the plugin using npm:

```bash
npm install -g homebridge-httptofile-plugin
```

## Configuration

To integrate the Temperature Sensor Logger plugin with your Homebridge setup, you will need to add it to the `accessories` section of your `config.json` file. Below is an example configuration that includes all available options for the plugin:

```json
{
  "accessories": [
    {
      "accessory": "TemperatureSensorLogger",
      "name": "Temperature Logger",
      "port": 8180,
      "dataPath": "/path/to/your/data/directory",
      "debug": false,
      "shouldSanitiseNumber": true
    }
  ]
}
```

### Configuration Options

- **accessory**: Must always be set to `"TemperatureSensorLogger"` for this plugin.
- **name**: Provide a unique name for this instance of the Temperature Sensor Logger. This name will be used within the Homebridge logs and UI to identify the accessory.
- **port** (optional): Specifies the port on which the HTTP server will listen for incoming data. The default port is `8080` if this option is not provided.
- **dataPath** (optional): The filesystem path where temperature data logs will be saved. Each sensor's data is saved in a separate file named `<sensor-id>.txt` within this directory. If not specified, a default directory named `data` will be created in the root of your Homebridge installation directory.
- **debug** (optional): Enables verbose logging when set to `true`. This includes detailed debug information useful for troubleshooting. The default value is `false`.
- **shouldSanitiseNumber** (optional): If set to `true`, the plugin attempts to sanitise the received temperature data to extract and log only the numerical value, discarding any non-numeric characters (e.g., units or letters). This is particularly useful if your temperature sensors send data in formats that include text, such as "23.5 °C". The default value is `false`.


## Usage

After configuring the plugin, it will start an HTTP server on the specified port (default is `8080`) and listen for incoming POST requests. Your temperature sensors need to be configured to send their data to this server in a specific JSON format.

### Expected Data Format

The plugin expects incoming HTTP POST requests with a JSON payload containing at least two key-value pairs: `id` and `temperature`. Here is an example of the JSON payload:

```json
{
    "id": "sensor1",
    "temperature": "22.5"
}
```
- `id` serves as a unique identifier for each of your temperature sensors. This identifier is crucial for organizing and storing the temperature readings, as it determines the filename under which each sensor's data is logged. Ensure each sensor has a distinct `id` to prevent data overlap and ensure logs are kept separate for each sensor.

- `temperature` represents the actual temperature reading from the sensor. When `shouldSanitiseNumber` is set to `true` in your configuration, the plugin employs a sanitization process on this data. This means it intelligently extracts numerical values from the string provided, effectively removing any non-numeric characters. This functionality is particularly useful for handling inputs that might include units or other text, such as "22.5°C" or "Temperature: 22.5", ensuring that only the numeric value "22.5" is logged.

## Logging

Temperature data received from each sensor is logged into individual files named after the sensor's unique ID (`<sensor-id>.txt`), located within the directory specified by the `dataPath` configuration option. Each file is dedicated to storing the latest temperature reading from its corresponding sensor, ensuring that data from different sensors are segregated and easily accessible.

## Troubleshooting

If you encounter any issues while using this plugin, enabling `debug` mode can provide more detailed logs that may offer insights into the problem. To activate debug mode, set the `debug` option to `true` in the plugin's configuration within your Homebridge `config.json` file. This will increase the verbosity of the logs, which can be invaluable for diagnosing and resolving issues.

## Contributing

Your contributions to improve the plugin or address issues are highly appreciated. Whether it's adding new features, fixing bugs, or improving documentation, please feel free to fork the repository, make your changes, and submit pull requests. If you encounter any bugs or have feature requests, please open an issue in the project's GitHub repository. We welcome contributions from the community to make the plugin better for everyone.

## License

This plugin is made available under the MIT License. This means you're free to use, modify, distribute, and make derivative works from this software, subject to the terms outlined in the LICENSE file included with the source code. The MIT License is a permissive license that imposes minimal restrictions on how the software can be used, making it a great choice for open-source projects.


