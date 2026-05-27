require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
  console.error('Missing TOKEN or CLIENT_ID in env');
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const cmd = require(path.join(commandsPath, file));
    if (cmd.data) commands.push(cmd.data.toJSON ? cmd.data.toJSON() : cmd.data);
  }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`Registering ${commands.length} commands...`);
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('Commands registered globally.');
  } catch (err) {
    console.error(err);
  }
})();
