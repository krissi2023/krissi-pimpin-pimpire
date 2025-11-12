# Krissi Pimpin' Pimpire - AI-Powered Gaming Platform

A comprehensive gaming platform featuring AI integration through Google's Gemini API and multiple casino-style games.

## 🎮 Features

### AI Integration
- **Google Gemini AI**: Full integration with Google's Gemini AI for intelligent game interactions
- **Real-time AI Chat**: Interactive AI chat for game assistance and entertainment
- **AI-Powered Content**: Generate dynamic game content and strategies

### Available Games

#### 🎰 Slot Games
- **Classic Slots**: Traditional 3-reel slot machine with multiple paylines
  - 7 unique symbols with varying payouts
  - 5 different payline combinations
  - Progressive betting system

#### 🃏 Card Games
- **Texas Hold'em Poker**: Complete implementation of the classic poker variant
  - Support for 2-8 players
  - Full game phases: preflop, flop, turn, river
  - Comprehensive betting system with fold, call, raise, check
  - All-in and side pot support

#### 🎲 Table Games
- **Blackjack**: Classic 21 card game (basic implementation)
- **High or Low**: Card prediction game
- **Draw**: Custom card drawing game

#### ⚡ Quick Games
- **Rock Paper Scissors**: Fast-paced hand game with:
  - Score tracking and statistics
  - Game history
  - Best-of-X tournament mode
  - Win rate analytics

## 🚀 Quick Start

### Prerequisites
- Node.js (18+ recommended)
- Google Gemini API key
- Docker (for containerization)

### Installation

1. **Clone and Install**
   ```bash
   git clone https://github.com/krissi2023/krissi-pimpin-pimpire.git
   cd krissi-pimpin-pimpire
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

3. **Run the Application**
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

## 🔧 API Documentation

### Game Endpoints

#### Initialize Games
- `POST /api/games/slots/init` - Initialize slot machine
- `POST /api/games/rps/init` - Initialize Rock Paper Scissors
- `POST /api/games/poker/init` - Initialize Texas Hold'em
- `POST /api/games/blackjack/init` - Initialize Blackjack

#### Game Actions
- `POST /api/games/slots/{gameId}/spin` - Spin the slot machine
- `POST /api/games/rps/{gameId}/play` - Play Rock Paper Scissors
  ```json
  { "choice": "rock|paper|scissors" }
  ```

#### AI Endpoints
- `GET /api/gemini/status` - Check AI service status
- `POST /api/gemini/generate` - Generate AI content
- `POST /api/gemini/chat` - Interactive AI chat

## 🐳 Docker Support

### Build and Run
```bash
docker build -t krissi-pimpin-pimpire .
docker run -p 3000:3000 --env-file .env krissi-pimpin-pimpire
```

### Using npm scripts
```bash
npm run docker:build
npm run docker:run
```

## ☁️ Red Hat Sandbox Deployment

This application is ready for deployment on Red Hat's OpenShift Sandbox. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Quick Deploy
```bash
# Login to OpenShift
oc login --token=your_token --server=your_server

# Create project
oc new-project krissi-pimpin-pimpire

# Deploy using Source-to-Image
oc new-app nodejs~https://github.com/krissi2023/krissi-pimpin-pimpire.git
oc expose svc/krissi-pimpin-pimpire
```

## 🏗️ Project Structure

```
krissi-pimpin-pimpire/
├── .openshift/              # OpenShift deployment configurations
├── SourceCode/              # Game implementations
│   ├── BonusGames/         # Future bonus game implementations
│   ├── CardGames/          # Poker and card-based games
│   ├── QuickGames/         # Fast-paced mini games
│   ├── SlotGames/          # Slot machine variants
│   ├── TableGames/         # Casino table games
│   └── LiveGames/          # Future live game implementations
├── server.js               # Main Express server
├── gemini-service.js       # AI service integration
├── Dockerfile              # Container configuration
├── package.json            # Dependencies and scripts
└── .env.example            # Environment template
```

## 🎯 Game Examples

### Playing Rock Paper Scissors
```bash
# Initialize game
curl -X POST http://localhost:3000/api/games/rps/init

# Play a round
curl -X POST http://localhost:3000/api/games/rps/{gameId}/play \
  -H "Content-Type: application/json" \
  -d '{"choice": "rock"}'
```

### Spinning Slots
```bash
# Initialize slot machine
curl -X POST http://localhost:3000/api/games/slots/init

# Spin the reels
curl -X POST http://localhost:3000/api/games/slots/{gameId}/spin
```

### AI Interaction
```bash
# Generate game strategy
curl -X POST http://localhost:3000/api/gemini/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Give me a strategy for playing poker"}'
```

## 🔒 Security Features

- Environment-based configuration
- OpenShift security compliance
- Resource limits and health checks
- TLS termination on routes
- Secrets management for API keys

## 📈 Monitoring & Health

- **Health Checks**: Liveness and readiness probes configured
- **Resource Limits**: CPU and memory limits set
- **Logging**: Structured logging for troubleshooting
- **Metrics**: Ready for OpenShift monitoring

## 🛠️ Development

### Adding New Games
1. Create your game class in the appropriate `SourceCode/` directory
2. Add the import to `server.js`
3. Create API endpoints following the existing pattern
4. Update the games list in the `/api/games` endpoint

### Environment Variables
- `NODE_ENV`: Development/production mode
- `GEMINI_API_KEY`: Google Gemini AI API key
- `PORT`: Server port (default: 3000)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the deployment guide in [DEPLOYMENT.md](DEPLOYMENT.md)
- Review the Gemini integration docs in [GEMINI_INTEGRATION.md](GEMINI_INTEGRATION.md)

---

**Ready to deploy to Red Hat Sandbox!** 🚀

This platform is fully configured and ready for cloud deployment with comprehensive game implementations and AI integration.

## Setting up the development container

### GitHub Codespaces
Follow these steps to open this sample in a Codespace:
1. Click the **Code** drop-down menu.
2. Click on the **Codespaces** tab.
1. Click **Create codespace on main** .

For more info, check out the [GitHub documentation](https://docs.github.com/en/free-pro-team@latest/github/developing-online-with-codespaces/creating-a-codespace#creating-a-codespace).
  
### VS Code Dev Containers

If you already have VS Code and Docker installed, you can click the badge above or [here](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/microsoft/vscode-remote-try-node) to get started. Clicking these links will cause VS Code to automatically install the Dev Containers extension if needed, clone the source code into a container volume, and spin up a dev container for use.

Follow these steps to open this sample in a container using the VS Code Dev Containers extension:

1. If this is your first time using a development container, please ensure your system meets the pre-reqs (i.e. have Docker installed) in the [getting started steps](https://aka.ms/vscode-remote/containers/getting-started).

2. To use this repository, you can either open the repository in an isolated Docker volume:

    - Press <kbd>F1</kbd> and select the **Dev Containers: Try a Sample...** command.
    - Choose the "Node" sample, wait for the container to start, and try things out!
        > **Note:** Under the hood, this will use the **Dev Containers: Clone Repository in Container Volume...** command to clone the source code in a Docker volume instead of the local filesystem. [Volumes](https://docs.docker.com/storage/volumes/) are the preferred mechanism for persisting container data.

    Or open a locally cloned copy of the code:

   - Clone this repository to your local filesystem.
   - Press <kbd>F1</kbd> and select the **Dev Containers: Open Folder in Container...** command.
   - Select the cloned copy of this folder, wait for the container to start, and try things out!

## Things to try

Once you have this sample opened, you'll be able to work with it like you would locally.

Some things to try:

1. **Edit:**
   - Open `server.js`
   - Try adding some code and check out the language features. 
   - Make a spelling mistake and notice it is detected. The [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) extension was automatically installed because it is referenced in `.devcontainer/devcontainer.json`.
   - Also notice that `eslint` and the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) are installed. Tools are installed in the `mcr.microsoft.com/devcontainers/javascript-node` image and Dev Container settings and metadata are automatically picked up from [image labels](https://containers.dev/implementors/reference/#labels).

2. **Terminal:** Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>\`</kbd> and type `uname` and other Linux commands from the terminal window.
3. **Build, Run, and Debug:**
   - Open `server.js`
   - Add a breakpoint (e.g. on line 20).
   - Press <kbd>F5</kbd> to launch the app in the container.
   - Once the breakpoint is hit, try hovering over variables, examining locals, and more.
   - Continue (<kbd>F5</kbd>). You can connect to the server in the container by either: 
      - Clicking on `Open in Browser` in the notification telling you: `Your service running on port 3000 is available`.
      - Clicking the globe icon in the 'Ports' view. The 'Ports' view gives you an organized table of your forwarded ports, and you can access it with the command **Ports: Focus on Ports View**.
   - Notice port 3000 in the 'Ports' view is labeled "Hello Remote World." In `devcontainer.json`, you can set `"portsAttributes"`, such as a label for your forwarded ports and the action to be taken when the port is autoforwarded. 
      - If we didn't know the port was 3000, we could've used a regex instead of "3000" in the `"portsAttributes"`, such as ".+/server.js".

   > **Note:** In Dev Containers, you can access your app at `http://localhost:3000` in a local browser. But in a browser-based Codespace, you must click the link from the notification or the `Ports` view so that the service handles port forwarding in the browser and generates the correct URL.
   
4. **Rebuild or update your container**

   You may want to make changes to your container, such as installing a different version of a software or forwarding a new port. You'll rebuild your container for your changes to take effect. 
   
   **Open browser automatically:** As an example change, let's update the `portsAttributes` in the `.devcontainer/devcontainer.json` file to open a browser when our port is automatically forwarded.
   
   - Open the `.devcontainer/devcontainer.json` file.
   - Modify the `"onAutoForward"` attribute in your `portsAttributes` from `"notify"` to `"openBrowser"`.
   - Press <kbd>F1</kbd> and select the **Dev Containers: Rebuild Container** or **Codespaces: Rebuild Container** command so the modifications are picked up.

5. **Install the GitHub CLI using a Dev Container Feature:**
   - Press <kbd>F1</kbd> and select the **Dev Containers: Configure Container Features...** or **Codespaces: Configure Container Features...** command.
   - Type "github" in the text box at the top.
   - Check the check box next to "GitHub CLI" (published by devcontainers) 
   - Click OK
   - Press <kbd>F1</kbd> and select the **Dev Containers: Rebuild Container** or **Codespaces: Rebuild Container** command so the modifications are picked up.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## License

Copyright © Microsoft Corporation All rights reserved.<br />
Licensed under the MIT License. See LICENSE in the project root for license information.
