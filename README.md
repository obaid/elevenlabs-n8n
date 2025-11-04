# @resemble/n8n-nodes-resemble

This is a Resemble AI n8n community node.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Speech
- Text to Speech - Converts text to speech audio by creating clips in projects

### Voice
- Get - Retrieve metadata about a specific voice
- Get Many - List all available voices with pagination
- Create - Create a new voice clone (rapid or professional)
- Delete - Delete a specific voice

## Credentials

This node requires an API Key from Resemble AI. You can generate one by:
1. Signing up at [Resemble AI](https://www.resemble.ai/)
2. Going to your account settings
3. Generating an API key from the API section

The API key should be in the format used by Resemble AI's authentication system.

## Compatibility

This node has been tested with n8n 1.94.0

## Usage

### Creating Clips (Text to Speech)

To convert text to speech using Resemble AI:

1. Select the **Speech** resource
2. Choose **Text to Speech** operation
3. Select a **Project** from your Resemble AI account
4. Select a **Voice** to use for synthesis
5. Enter the **Text** you want to convert
6. Optionally configure:
   - Title for the clip
   - Sample rate (default: 44100)
   - Output format (MP3 or WAV)
   - Audio precision (PCM_16, PCM_24, PCM_32, MULAW)
   - Whether to include timestamps
   - Whether to return binary audio data (default: true)

### Managing Voices

**Get a Voice:**
- Select the **Voice** resource
- Choose **Get** operation
- Select or enter the voice UUID

**List All Voices:**
- Select the **Voice** resource
- Choose **Get Many** operation
- Set the limit and page number for pagination
- Optionally simplify the response

**Create a Voice:**
- Select the **Voice** resource
- Choose **Create** operation
- Enter a name for the voice
- Select voice type (Rapid or Professional)
  - **Rapid**: Fast clone requiring 10+ seconds of audio (created in under 1 minute)
  - **Professional**: High-quality clone requiring 10+ minutes of audio (takes ~40 minutes)
- Optionally provide:
  - Dataset URL (link to training audio files)
  - Language code (default: en-US)
  - Callback URI (webhook for completion notifications)

**Delete a Voice:**
- Select the **Voice** resource
- Choose **Delete** operation
- Select or enter the voice UUID to delete

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Resemble AI Documentation](https://docs.app.resemble.ai/)
* [Resemble AI Website](https://www.resemble.ai/)

## Notes

This node was converted from an ElevenLabs implementation to work with Resemble AI's API. Key differences:

- Text-to-speech requires a project UUID in Resemble AI
- Voice creation uses dataset URLs instead of direct file uploads
- Speech-to-text and speech-to-speech operations are not available in the Resemble AI API
- Authentication uses Token-based authorization instead of API key headers
