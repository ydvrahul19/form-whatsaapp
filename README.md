# Form + History + WhatsApp group (Vercel version)

Folder layout:

    public/index.html   the page (your WhatsApp link is already set inside)
    api/submit.js       saves an entry
    api/history.js      returns saved history
    api/_db.js          database helper (Upstash Redis)
    package.json

## Step 1: Deploy
Option A (easiest): push this folder to a GitHub repo, then in Vercel click
Add New > Project > import the repo > Deploy. No settings needed.

Option B: in this folder run `npx vercel` and follow the prompts.

## Step 2: Check
Open your Vercel URL. The form works right away, but until Step 3 history is
only temporary and a red warning shows under the History table.

## Step 3: Connect the free database (so history is really saved)
1. Vercel dashboard > your project > Storage (or Marketplace) > Upstash > Redis > Create (free plan).
2. Connect it to your project. It adds the environment variables automatically
   (KV_REST_API_URL and KV_REST_API_TOKEN).
3. Redeploy (Deployments > ... > Redeploy).
4. The red warning disappears and every submit is stored permanently.

## How the WhatsApp step works
After Submit, WhatsApp opens with the message already typed in. Pick the group
(it is usually at the top of recent chats) and tap Send.

A group invite link (chat.whatsapp.com) can only open the join screen. It cannot
carry text, so it is not used. WhatsApp does not let a website choose a specific
group and post into it automatically.
