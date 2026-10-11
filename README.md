# Sample Form + History + WhatsApp Group

## What it does
1. You fill the form (name, customers, visitors, notes).
2. On Submit it saves the entry to `database.json` (your history).
3. It copies a ready-made message to the clipboard.
4. It opens your WhatsApp group. You paste the message and press send.

(WhatsApp does not allow a website to post into a group automatically, so the paste step is needed.)

## Run it
1. Install Node.js (https://nodejs.org), any version 16 or newer.
2. Unzip this folder.
3. Your WhatsApp group link is already set in `index.html` (search for `WHATSAPP_GROUP_LINK` to change it).
4. In a terminal inside the folder, run:

       node server.js

5. Open http://localhost:3000

## Test on your phone (same Wi-Fi)
Find your computer's IP address (for example 192.168.1.5) and open
`http://192.168.1.5:3000` on your phone. The WhatsApp app will open the group.

## Where is the data?
In `database.json`, created in the same folder after the first submit. Delete the file to clear the history.

## Going live later
Upload to a host that runs Node (Render, Railway, a VPS). For many users,
move from the JSON file to SQLite, MySQL or MongoDB.
