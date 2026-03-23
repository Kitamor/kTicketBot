<div align="center">
  <img src="figures/logo.png" width="60%" alt="kTicketBot" />
</div>
<hr>

kTicketBot is an advanced and customizable ticket system for your Discord server. It allows you to communicate professionally with your customers and manage your support team efficiently.

## 🚀 Features

kTicketBot offers much more than a standard ticket bot:

- **Multi-language Support:** All messages and buttons can be configured in both Turkish and English (TR/EN out of the box).
- **Flexible Configuration:** Customize everything via the `config.js` file to suit your needs.
- **Category Selection:** Use buttons or menus to categorize tickets for easier management.
- **Staff Assignment System:** Staff can assign tickets to themselves, ensuring clear responsibility.
- **Advanced Ranking System:** Track staff performance (number of tickets handled, message counts, average rating).
- **Transcript System:** Automatically saves HTML/text logs of closed tickets in the "transcripts" folder and sends them to your log channel.
- **Survey System:** Ask users questions like "How did you hear about us?" before they open their first ticket.
- **Blacklist System:** Prevent specific users from opening tickets permanently.
- **Anti-Ghosting:** Automatically closes tickets if the owner leaves the server and provides a reopen button if they return.
- **Custom Prefix Commands:** Create rapid-reply commands using your preferred bot prefix.

## 🛠️ Installation

Follow these steps to set up the bot:

1. **Requirements:**
   - [Node.js](https://nodejs.org/) (Version `v18.20.6` is recommended).
   - A Discord Bot Token.

2. **Download Files:**
   Download the project and extract it to a folder.

3. **Install Dependencies:**
   Open a terminal/command prompt in the project folder and run:
   ```bash
   npm install
   ```

4. **Configuration:**
   Open the `config.js` file with a text editor (VS Code, Notepad, etc.):
   - `token`: Enter your bot token here.
   - `guildId`: Enter your server ID.
   - `owners`: Add the IDs of the bot owners in an array.
   - Adjust other settings as needed.

5. **Start the Bot:**
   Run `start.bat` or use the command in your terminal:
   ```bash
   node index.js
   ```

## 📢 Usage & Setup Command

Once the bot is running, complete the setup on your server:

1. As a bot owner (listed in the config), go to any channel on your server.
2. Use the following command to send the ticket opening message:
   ```text
   !setup en-US
   ```
   *(For Turkish setup, use `!setup tr`.)*

3. The bot will send a stylish embed message with a ticket creation button in the specified language.

## 📄 License

This software is licensed under the [MIT License](LICENSE).

---
**Need help? Join our Discord:** [Click here](https://discord.gg/7S8y9ntrbe)
