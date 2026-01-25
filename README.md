
<div align="center">
  <img src="figures/logo.png" width="60%" alt="kTicketBot" />
  <h1>kTicketBot</h1>
  <p>A modern, customizable Discord Ticket Bot with multi-language support.</p>
</div>

<hr>

## 🚀 Introduction

kTicketBot is a powerful solution for managing support tickets on your Discord server. It features a modern, button-based interface, multi-language support (Turkish & English), and a highly customizable configuration system.

## ✨ Features

- **Multi-language Support:** Fully localized messages and buttons (Turkish & English included).
- **Modern Configuration:** Easy-to-read YAML configuration and environment variables for security.
- **Advanced Ticket Management:**
  - Create tickets via buttons or menus.
  - Category-specific forms (modals) for pre-sales or support.
  - Staff assignment and ranking system.
  - Transcript generation (saved locally).
  - Rate limiting and blacklist system.
- **Customizable:** Everything from messages to channel names can be edited in `src/config.yml` and `src/locales/`.

## 🛠️ Setup Guide

### Prerequisites
- **Node.js**: Version v18.x or higher is recommended. [Download Node.js](https://nodejs.org/)
- **Discord Bot Token**: You need a bot application. [Discord Developer Portal](https://discord.com/developers/applications)

### Installation

1.  **Clone or Download** the project to your computer.
2.  Open a terminal in the project folder and install dependencies:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    - Rename the `.env.example` file to `.env`.
    - Open `.env` and fill in your details:
      ```ini
      TOKEN=your_bot_token_here
      GUILD_ID=your_server_id
      OWNER_IDS=your_user_id
        ```

### Configuration

The bot uses **YAML** for configuration, making it easy to read and edit.

-   **General Settings**: Edit `src/config.yml` to change bot behavior, categories, and permissions.
-   **Localization**:
    -   `src/locales/tr.yml`: Edit for Turkish messages.
    -   `src/locales/en-US.yml`: Edit for English messages.

### Running the Bot

You can start the bot using the startup script or directly via Node.js:

-   **Windows**: Double-click `start.bat`.
-   **Manual**:
    ```bash
    node index.js
    ```

## 📝 License

This software is released under the [MIT License](LICENSE).

<hr>
<div align="center">
  <p>Need help? <a href="https://discord.gg/7S8y9ntrbe">Join our Discord Server</a></p>
</div>
