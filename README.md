# Vote-Logger

## Introduction
**Vote-Logger** is a really simple NodeJs process to run a vote logger that saves the vote into redis and also has a websocket to log votes external.

## How to Use
To get started with Vote-Logger:

1. **Explore the Code:** Familiarize yourself with the source code to understand how everything works and how websockets are used for communication between services.
2. **Clone and Configure:** Clone this repository to your local machine. Before running the application, you'll need to set up your configuration files as described below.
3. **Understand the License:** Ensure you read and comply with the license terms of this repository.

## Configuration Files
You need to create and configure the following JSON files:

### `src/CONFIGS/auth.json`
This file contains authentication tokens necessary for Redis and websocket communication.


### `src/CONFIGS/bots.json`
This file specifies the allowed bots there auth tokens for the Botlists and the vote length how long the vote counts.

### `src/CONFIGS/port.json`
This file specifies the ports the service should run on.
```json
{
  "httpPort": 8080, 
  "wsPort": 8081 
}
```

### `src/CONFIGS/botlists.json`
This file can be ignored its only there to identify the current requesting botlist.


## Contributions and Feedback
Your contributions and feedback are welcome to improve this project. Feel free to submit issues or pull requests for enhancements.

