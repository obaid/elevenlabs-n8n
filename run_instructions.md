# Running the Resemble AI Node in n8n

This guide will walk you through setting up n8n on macOS and using the Resemble AI community node.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setting Up n8n on Mac](#setting-up-n8n-on-mac)
- [Installing the Resemble AI Node](#installing-the-resemble-ai-node)
- [Getting Your Resemble AI API Key](#getting-your-resemble-ai-api-key)
- [Configuring Credentials in n8n](#configuring-credentials-in-n8n)
- [Creating Your First Workflow](#creating-your-first-workflow)
- [Example Workflows](#example-workflows)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:
- macOS (10.15 or later)
- Node.js 20.15 or higher
- A Resemble AI account (sign up at [resemble.ai](https://www.resemble.ai/))
- Basic familiarity with command line terminal

---

## Setting Up n8n on Mac

You have three options to run n8n on macOS:

### Option 1: Using npm/npx (Recommended)

This is the quickest way to get started:

```bash
# Run n8n directly with npx (no installation needed)
npx n8n

# OR install n8n globally
npm install n8n -g
n8n
```

n8n will start on `http://localhost:5678`

### Option 2: Using Docker

If you have Docker installed:

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Option 3: n8n Desktop App

Download the n8n Desktop app from [n8n.io/download](https://n8n.io/download)

---

## Installing the Resemble AI Node

There are two methods to install the custom node:

### Method 1: Install from Local Directory (Development)

1. **Clone and build the node:**
   ```bash
   # Navigate to where you want to store the node
   cd ~/projects

   # Clone the repository
   git clone https://github.com/obaid/elevenlabs-n8n.git
   cd elevenlabs-n8n

   # Install dependencies and build
   npm install
   npm run build
   ```

2. **Link the node globally:**
   ```bash
   # In the elevenlabs-n8n directory
   npm link
   ```

3. **Install in n8n:**
   ```bash
   # Navigate to your n8n installation directory
   cd ~/.n8n

   # Link the node
   npm link @resemble/n8n-nodes-resemble
   ```

4. **Restart n8n:**
   ```bash
   # Stop n8n (Ctrl+C in the terminal running n8n)
   # Then restart it
   n8n
   # or
   npx n8n
   ```

### Method 2: Install via n8n Community Nodes (When Published)

Once this node is published to npm:

1. Open n8n in your browser (`http://localhost:5678`)
2. Go to **Settings** → **Community Nodes**
3. Click **Install**
4. Enter: `@resemble/n8n-nodes-resemble`
5. Click **Install**

---

## Getting Your Resemble AI API Key

1. **Sign up for Resemble AI:**
   - Go to [resemble.ai](https://www.resemble.ai/)
   - Click **Sign Up** and create an account

2. **Access your API settings:**
   - Log in to your Resemble AI account
   - Navigate to **Account Settings** or **API Settings**
   - Look for the **API Key** section

3. **Generate an API key:**
   - Click **Generate API Key** or **Create New Key**
   - Copy the API key (it will look something like: `abc123def456...`)
   - **Important:** Save this key securely - you won't be able to see it again!

4. **Create a Project (Required for Text-to-Speech):**
   - In the Resemble AI dashboard, navigate to **Projects**
   - Click **Create New Project**
   - Give it a name (e.g., "n8n Integration")
   - Note the project UUID (you'll need this later)

---

## Configuring Credentials in n8n

1. **Open n8n** in your browser (`http://localhost:5678`)

2. **Navigate to Credentials:**
   - Click on your profile icon (top right)
   - Select **Credentials**

3. **Add Resemble AI credentials:**
   - Click **Add Credential**
   - Search for "Resemble" in the search bar
   - Select **Resemble AI API**

4. **Enter your API key:**
   - In the **Resemble API Key** field, paste your API key
   - Click **Save**

5. **Test the connection:**
   - The credential will automatically test against the Resemble AI API
   - If successful, you'll see a green checkmark

---

## Creating Your First Workflow

Let's create a simple workflow that converts text to speech using Resemble AI.

### Basic Text-to-Speech Workflow

1. **Create a new workflow:**
   - Click **Add Workflow** or the **+** button
   - Name it "Resemble AI Text-to-Speech Demo"

2. **Add a Manual Trigger:**
   - Click **Add first step**
   - Search for "Manual Trigger"
   - Select **Manual Trigger**
   - This lets you run the workflow manually

3. **Add the Resemble AI node:**
   - Click the **+** button to add a new node
   - Search for "Resemble AI"
   - Select **Resemble AI**

4. **Configure the Resemble AI node:**
   - **Credential to connect with:** Select the credential you created earlier
   - **Resource:** Select **Speech**
   - **Operation:** Select **Text to Speech**
   - **Project:** Select your project from the dropdown (or enter the UUID)
   - **Voice:** Select a voice from the dropdown
   - **Text:** Enter the text you want to convert, e.g., "Hello, this is a test of Resemble AI integration with n8n."

5. **Add Additional Options (Optional):**
   - Click **Add Option**
   - Configure:
     - **Title:** "My First Audio Clip"
     - **Sample Rate:** 44100 (default)
     - **Output Format:** MP3
     - **Return Binary:** true (to get the audio file)

6. **Save the workflow:**
   - Click **Save** (top right)

7. **Execute the workflow:**
   - Click **Execute Workflow** (bottom right)
   - Wait for the execution to complete
   - You should see the audio file in the output

8. **Download the audio:**
   - In the output panel, you should see a binary data object
   - Click on it to listen or download the MP3 file

---

## Example Workflows

### Example 1: Voice Management Workflow

Create a workflow to list and manage your voices:

```
Manual Trigger → Resemble AI (Get Many Voices) → Display Results
```

**Configuration:**
1. Manual Trigger node
2. Resemble AI node:
   - Resource: **Voice**
   - Operation: **Get Many**
   - Limit: 10
   - Simplify: true

### Example 2: Automated Text-to-Speech from Webhook

Create an API endpoint that converts text to speech:

```
Webhook → Resemble AI (Text to Speech) → Respond to Webhook
```

**Configuration:**
1. Webhook node:
   - HTTP Method: POST
   - Path: `text-to-speech`

2. Resemble AI node:
   - Resource: **Speech**
   - Operation: **Text to Speech**
   - Project: Select your project
   - Voice: Select a voice
   - Text: `{{$json.text}}` (from webhook body)
   - Return Binary: true

3. Respond to Webhook node:
   - Respond With: Binary File
   - Binary Property: `data`

**Test it:**
```bash
curl -X POST http://localhost:5678/webhook/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from the webhook!"}'
```

### Example 3: Create Voice Clone Workflow

Automate voice clone creation:

```
Manual Trigger → Resemble AI (Create Voice) → Notify
```

**Configuration:**
1. Manual Trigger node

2. Resemble AI node:
   - Resource: **Voice**
   - Operation: **Create**
   - Name: "My Voice Clone"
   - Voice Type: **Rapid** (or Professional)
   - Additional Fields:
     - Dataset URL: URL to your audio dataset
     - Language: "en-US"

### Example 4: Batch Text-to-Speech Processing

Convert multiple texts to speech:

```
Manual Trigger → Code Node (Generate Texts) → Resemble AI (Text to Speech) → Save Files
```

**Configuration:**
1. Manual Trigger node

2. Code node:
   ```javascript
   return [
     { text: "First sentence to convert." },
     { text: "Second sentence to convert." },
     { text: "Third sentence to convert." }
   ];
   ```

3. Resemble AI node:
   - Resource: **Speech**
   - Operation: **Text to Speech**
   - Text: `{{$json.text}}`
   - Title: `{{$json.text.substring(0, 30)}}`

4. Loop back to process all items

---

## Troubleshooting

### Issue: "Resemble AI node not appearing in n8n"

**Solution:**
1. Make sure the node is properly installed:
   ```bash
   cd ~/.n8n
   npm list @resemble/n8n-nodes-resemble
   ```

2. Restart n8n completely (stop and start, not just refresh browser)

3. Clear n8n cache:
   ```bash
   rm -rf ~/.n8n/cache
   ```

4. Check n8n logs for errors:
   ```bash
   # When running n8n, check the terminal output for errors
   ```

### Issue: "Authentication failed"

**Solution:**
1. Verify your API key is correct
2. Make sure the API key has proper permissions in Resemble AI
3. Test the API key directly:
   ```bash
   curl -H "Authorization: Token token=YOUR_API_KEY" \
     https://app.resemble.ai/api/v2/voices
   ```

### Issue: "Project not found"

**Solution:**
1. Verify you have created a project in Resemble AI dashboard
2. Use the project UUID, not the project name
3. Make sure your API key has access to the project

### Issue: "Voice not found"

**Solution:**
1. Check that you have voices in your Resemble AI account
2. Run the "Get Many Voices" operation to list available voices
3. Use the voice UUID returned from that operation

### Issue: "Audio binary data not returned"

**Solution:**
1. Make sure **Return Binary** option is set to `true`
2. Check that the clip was created successfully in Resemble AI dashboard
3. Verify the `audio_src` URL is accessible

### Issue: "Build errors when installing"

**Solution:**
1. Make sure you have Node.js 20.15 or higher:
   ```bash
   node --version
   ```

2. Clear npm cache and reinstall:
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. Check for TypeScript errors:
   ```bash
   npm run lint
   ```

---

## Additional Resources

- **n8n Documentation:** [https://docs.n8n.io/](https://docs.n8n.io/)
- **Resemble AI Documentation:** [https://docs.app.resemble.ai/](https://docs.app.resemble.ai/)
- **n8n Community Forum:** [https://community.n8n.io/](https://community.n8n.io/)
- **Resemble AI Support:** [support@resemble.ai](mailto:support@resemble.ai)

---

## Tips for Success

1. **Start Simple:** Begin with the basic text-to-speech workflow before creating complex automations

2. **Use Manual Trigger:** Test your workflows with Manual Trigger before switching to automatic triggers

3. **Check Project Setup:** Always ensure you have a project created in Resemble AI before attempting text-to-speech

4. **Monitor API Limits:** Be aware of your Resemble AI plan limits and usage

5. **Save Workflows:** Regularly save your workflows to avoid losing changes

6. **Use Error Workflows:** Set up error notification workflows to catch issues in production

7. **Test Voice Quality:** Try different voices and settings to find the best quality for your use case

---

## Next Steps

Now that you have the Resemble AI node set up:

1. Experiment with different voices and settings
2. Create more complex workflows combining multiple nodes
3. Integrate with other services (Slack, email, databases, etc.)
4. Set up scheduled workflows for batch processing
5. Share your workflows with the n8n community!

Happy automating! 🚀
