# 🏇 Umamusume Trainer - MCP Server

A Model Context Protocol (MCP) server that provides AI-powered tools for the game Umamusume Pretty Derby. This server enables Claude AI to help you with champion meeting information, rating calculations, and stamina validation.

## ✨ Features

This MCP server provides three powerful tools:

### 🏆 Champions Meeting
Get detailed information about Champion Meeting events:
- **Current, Previous, or Next** - Query meetings by scope
- **Search by Name** - Find specific champion meetings
- Returns venue, surface, distance, category, direction, condition, season, and weather information

### 📊 Rating Calculator
Calculate your Umamusume's rating before the end of a career run:
- Analyzes stats from game screenshots
- Processes skills and validates each stat
- Provides detailed rating calculations
- Auto-updates data daily for accuracy

### ⚡ Validate Stamina
Check if your Umamusume has sufficient stamina for a Champions Meeting Cup:
- Validates stamina requirements for specific races
- Helps optimize your training strategy

## 🚀 Quick Start

### Prerequisites
- Node.js >= 24.0.0
- npm or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mcp-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Start the server**
   ```bash
   npm run server
   ```

   The server will start on `http://localhost:5096`

### Development Mode
For development with hot reload:
```bash
npm run dev
```

## 🌐 Using with Claude

### Option 1: Claude Web (claude.ai)

**Important:** Claude Web requires HTTPS (ports 80/443) with a valid SSL certificate. You'll need to expose your server using one of these methods:

#### Using Cloudflare Tunnel (Recommended)
1. Install [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/)
2. Authenticate and create a tunnel:
   ```bash
   cloudflared tunnel login
   cloudflared tunnel create umamusume-trainer
   ```
3. Run the tunnel:
   ```bash
   cloudflared tunnel --url http://localhost:5096
   ```
4. Copy the provided HTTPS URL

#### Using ngrok
1. Install [ngrok](https://ngrok.com/)
2. Run:
   ```bash
   ngrok http 5096
   ```
3. Copy the HTTPS URL provided

#### Connecting to Claude Web
1. Go to [claude.ai](https://claude.ai)
2. Open any conversation
3. Click the **MCP** icon (puzzle piece) in the input area
4. Click **"Add Server"**
5. Enter the MCP discovery URL:
   ```
   https://umamusume.training/.well-known/mcp.json
   ```
6. The server will connect automatically

### Option 2: Claude Desktop

#### macOS/Linux Configuration

1. Open Claude Desktop settings
2. Navigate to **Developer** → **Edit Config**
3. Add the server configuration to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "umamusume-trainer": {
      "url": "https://umamusume.training/mcp"
    }
  }
}
```

4. Restart Claude Desktop

#### Windows Configuration

1. Open `%APPDATA%\Claude\claude_desktop_config.json`
2. Add the same configuration as above
3. Restart Claude Desktop

## 📋 Server Endpoints

- **MCP Endpoint:** `/mcp` or `/`
- **Discovery:** `/.well-known/mcp.json`
- **Health Check:** `/health`

## 🛠️ Technical Details

- **Protocol Version:** 2025-06-18
- **Transport:** Streamable HTTP
- **Default Port:** 5096
- **Framework:** Hono
- **Runtime:** Node.js

## 🎯 Usage Examples

Once connected to Claude, you can ask questions like:

- *"What's the current Champions Meeting?"*
- *"Calculate the rating for my Umamusume with these stats: [provide stats]"*
- *"Does my Umamusume have enough stamina for the next Champions Meeting?"*
- *"Find information about the Winter Champions Meeting"*

## 📝 Development

### Project Structure
```
mcp-server/
├── src/
│   ├── index.ts          # Main server setup
│   ├── server.ts         # Server entry point
│   └── tools/            # MCP tools
│       ├── champions_meeting.ts
│       ├── rating_calculator/
│       └── validate_stamina/
├── public/
│   └── index.html        # Homepage
└── package.json
```

### Available Scripts
- `npm run dev` - Development mode with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run server` - Start development server with env file

## 🔧 Troubleshooting

### Server won't connect to Claude Web
- Ensure you're using HTTPS with a valid SSL certificate
- Verify the `/.well-known/mcp.json` endpoint is accessible
- Check that ports 80 or 443 are properly forwarded

### Server won't connect to Claude Desktop
- Verify the URL in your config matches `https://umamusume.training/mcp`
- Check the config file path and JSON syntax
- Restart Claude Desktop after configuration changes
- Check logs in Claude Desktop's developer console

### Tools not appearing in Claude
- Confirm the server is running (`/health` endpoint should return `{"status":"ok"}`)
- Check that the MCP discovery endpoint returns valid JSON
- Verify protocol version compatibility

## 📄 License

[Your License Here]

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Claude AI](https://claude.ai)
- [Hono Framework](https://hono.dev)
