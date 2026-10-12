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

## Changing the WhatsApp link
Edit `WHATSAPP_GROUP_LINK` in `public/index.html` and redeploy.

## Note
WhatsApp does not allow a website to post into a group automatically. After
Submit the message is copied, the group opens, and you paste and send.
