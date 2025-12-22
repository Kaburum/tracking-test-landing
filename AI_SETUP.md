# Azure OpenAI Configuration Guide

## Current Status
The website is currently running in **Demo Mode** with mock AI responses and placeholder images.

## Why Mock Mode?
The AI features require Azure OpenAI service configuration, which includes:
- Azure OpenAI endpoint URL
- API key
- Deployment names for GPT and DALL-E models

Without these credentials, the app uses fallback logic with:
- Pre-written humorous templates
- DiceBear avatar placeholder images

## How to Enable Real AI

### Step 1: Create Azure OpenAI Resource
1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new **Azure OpenAI** resource
3. Note your endpoint URL (e.g., `https://your-resource.openai.azure.com`)
4. Get your API key from the resource

### Step 2: Deploy Models
Deploy the following models in your Azure OpenAI resource:
- **GPT-3.5 Turbo** or **GPT-4** (for text generation)
  - Note the deployment name (e.g., `gpt-35-turbo`)
- **DALL-E 3** (for image generation) - Optional
  - Note the deployment name (should be `dall-e-3`)

### Step 3: Configure Local Development
1. Copy `api/local.settings.json.template` to `api/local.settings.json`
2. Update the values:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AZURE_OPENAI_ENDPOINT": "https://YOUR-RESOURCE-NAME.openai.azure.com",
    "AZURE_OPENAI_KEY": "your-actual-api-key-here",
    "AZURE_OPENAI_DEPLOYMENT": "gpt-35-turbo"
  }
}
```
3. Run the function app locally: `cd api && func start`

### Step 4: Configure Azure Production
1. Go to your Azure Static Web App in Azure Portal
2. Navigate to **Configuration** → **Application settings**
3. Add the following settings:
   - `AZURE_OPENAI_ENDPOINT`: `https://YOUR-RESOURCE-NAME.openai.azure.com`
   - `AZURE_OPENAI_KEY`: Your API key
   - `AZURE_OPENAI_DEPLOYMENT`: `gpt-35-turbo` (or your deployment name)
4. Save and restart the app

## Checking Logs
The API now includes detailed logging to help diagnose issues:
- Check Azure Function logs in Application Insights
- Look for "=== AI Configuration Status ===" in logs
- It will show whether environment variables are configured

## Response Indicators
When the frontend makes a request:
- **🤖** icon = AI-powered response (Azure OpenAI)
- **🎭** icon = Demo mode response (mock data)

Console logs will also show: "Mode: AI-powered" or "Mode: Demo mode with placeholders"

## Cost Considerations
- Azure OpenAI is a paid service
- GPT-3.5 Turbo: ~$0.0015 per request
- DALL-E 3: ~$0.04 per image
- Demo mode is free and works without any configuration

## Troubleshooting

### "AI not configured" in logs
- Environment variables are not set correctly
- Check Application Settings in Azure Portal

### "Azure OpenAI API error: 401"
- Invalid API key
- Check your key in Azure Portal

### "Azure OpenAI API error: 404"
- Deployment name is incorrect
- Verify deployment name in Azure OpenAI Studio

### Images not generating
- DALL-E 3 deployment might not be available
- Falls back to DiceBear avatars automatically
- Check logs for specific DALL-E error messages

## Testing
1. **With Mock Mode**: Just use the app - it works immediately
2. **With AI Mode**: Configure environment variables, then test with logs open
3. Check browser console for "Mode: AI-powered" message
4. Check Azure Function logs for detailed AI request/response info
