import OHDRcon from '@afocommunity/ohd-rcon';
import 'dotenv/config';

const host = process.env.HOST;
if (host == null)
  throw new Error('HOST not specified! Did you set up your .env?');
const port = process.env.PORT;
if (port == null)
  throw new Error('PORT not specified! Did you set up your .env?');
const password = process.env.PASSWORD;
if (password == null)
  throw new Error('PASSWORD not specified! Did you set up your .env?');
let remote = process.env.REMOTE;
if (remote == null) {
  console.info(
    "REMOTE not specified. Defaulting to PERPGamer's remote ban list"
  );
  remote =
    'https://raw.githubusercontent.com/PERPGamer/OHD-Communtiy-Ban-List/main/Bans.cfg';
}

const banList = new Set();

async function main() {
  console.log(`Connection to ${host}:${port}`);
  const server = new OHDRcon.OHD(
    process.env.HOST,
    process.env.PORT,
    process.env.PASSWORD
  );

  server.onReady
    .then(async () => {
      console.log('Connected Successfully!');
      await pullBanList();
      setInterval(pullBanList, 1000 * 60 * 30);
      server.on('PLAYER_JOINED', (player) => {
        if (player.isBot) return;
        console.log(`${player.name} connected. (${player.id})`);
        if (banList.has(player.steam64)) player.ban();
      });
      server.on('PLAYER_LEFT', (player) => {
        if (player.isBot) return;
        console.log(`${player.name} disconnected. (${player.id})`);
      });
    })
    .catch((e) => {
      console.error('Connection Failed! Please double check your .env!');
    });
}

async function pullBanList() {
  console.log(`Pulling remote ban list from ${remote}`);
  fetch(remote)
    .then((r) => r.text())
    .then((bancfg) => {
      const reg = /^(?<steamid>\d{17}):(?<length>\d*)/gm;
      const resp = bancfg.matchAll(reg);
      let counter = 0;
      for (const [_, steamid] of resp) {
        banList.add(steamid);
        counter++;
      }
      console.log(`Loaded ${counter} bans.`);
    });
}

main();
