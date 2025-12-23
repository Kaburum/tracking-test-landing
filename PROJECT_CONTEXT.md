# Project Context for LLM

## Project Overview

**Project Name**: Tracking Test Landing Page  
**GitHub Repository**: https://github.com/Kaburum/tracking-test-landing  
**Purpose**: A modern web app with AI-powered humor generation, image creation, and comprehensive tracking/analytics features  
**Status**: ✅ Deployed to Azure Static Web Apps. All features operational with cookie consent management.

## Project Structure

```
tracking-test-landing/
├── index.html              # Main landing page with AI humor generator
├── kids.html               # 🆕 Family New Year greetings page (Russian)
├── README.md               # Project documentation
├── .gitignore              # Git ignore rules
├── PROJECT_CONTEXT.md      # This file
└── api/                    # Backend API (Azure Functions v3)
    ├── host.json           # Azure Functions configuration
    ├── package.json        # Node.js dependencies
    ├── API.md              # API documentation
    ├── track/              # Track events endpoint
    │   ├── function.json   # Function configuration
    │   └── index.js        # POST /api/track implementation
    ├── health/             # Health check endpoint
    │   ├── function.json   # Function configuration
    │   └── index.js        # GET /api/health implementation
    ├── humorize/           # AI humor generator endpoint
    │   ├── function.json   # Function configuration
    │   └── index.js        # POST /api/humorize (gpt-5-nano)
    ├── family-greeting/    # 🆕 Family greetings generator
    │   ├── function.json   # Function configuration
    │   └── index.js        # POST /api/family-greeting (gpt-4.1)
    ├── generate-image/     # 🆕 Separate image generation endpoint
    │   ├── function.json   # Function configuration
    │   └── index.js        # POST /api/generate-image (DALL-E 3)
    └── config-check/       # 🆕 Environment variable diagnostics
        ├── function.json   # Function configuration
        └── index.js        # GET /api/config-check
```

## Technology Stack

### Frontend
- **Pure HTML/CSS/JavaScript** (no frameworks)
- Responsive design with gradient background
- Vanilla JavaScript for tracking implementation
- Automatic API URL detection (local vs production)

### Backend
- **Azure Functions** (Node.js v3 programming model)
- Serverless architecture
- RESTful API endpoints
- CORS enabled for cross-origin requests
- **Azure OpenAI integration**: 
  - gpt-5-nano for main humor generator
  - gpt-4.1 for family greetings (more creative)
  - DALL-E 3 for AI-generated images

### Tracking & Analytics
- **Bing UET (Universal Event Tracking)** integration
- Real-time event monitoring
- Custom event tracking

### Deployment
- **GitHub**: Version control (Kaburum/tracking-test-landing)
- **Azure Static Web Apps**: Hosting platform (currently being configured)
- **GitHub Actions**: Automated CI/CD (will be auto-created by Azure)

## Current Features

### Frontend (`index.html`)
1. **Page Layout & Design**
   - Clean title: "Welcome to the Best Website Ever"
   - Gradient purple background
   - Responsive, mobile-friendly design
   - Simplified single-column layout
   - Tracking status indicator (bottom right)

2. **AI Humor Generator** (Primary Feature - Top of Page)
   - Text input area (up to 1000 characters)
   - AI-powered humorous text reinterpretation (gpt-5-nano)
   - **Two-step generation**: Text loads first, image follows
   - Separate image generation endpoint for better UX
   - **AI-generated images** using DALL-E 3 or fun cartoon avatars
   - 10 playful avatar styles (robots, characters, emoji-based)
   - One-click generation and regeneration
   - Loading animations and error handling
   - Image error handling with automatic fallbacks
   - Tracks humor generation events via UET

3. **Family New Year Greetings Page** (`/kids.html`) 🆕
   - Russian-language interface for family use
   - Personalized greetings for 5 family members:
     - Тая (13) - танцы, акробатика, шоколад, сноуборд, Stranger Things
     - Сева (11) - KFC, игры, кикбоксинг, гитара, горные лыжи, Stranger Things
     - Зоя (9) - гимнастика, барабаны, рисование, горные лыжи, Stranger Things
     - Арина (мама) - учеба, бег, уборка, велосипед, горные лыжи, Stranger Things
     - Женя (папа) - Microsoft PM, спорт, гаджеты, велосипед, сноуборд, Stranger Things
   - Default input: "В следующем году я хочу " (pre-filled)
   - Random family member selection for each greeting
   - AI generates 400-500 character funny stories (gpt-4.1)
   - Stories show HOW person will achieve their wish (personalized humor)
   - Two-step generation: text first, then DALL-E 3 image
   - Highly detailed personal descriptions for AI context
   - Mock fallback when AI unavailable
   - Not linked from main page (direct URL access only)

4. **Cookie Consent Banner**
   - Fixed bottom banner with slide-up animation
   - GDPR-compliant consent management
   - Accept/Decline options
   - Stores consent in localStorage
   - Controls UET tracking based on consent
   - UET consent state integration (`consent.grant`/`consent.deny`)
   - Responsive mobile/desktop design

5. **Bing UET Tracking with Consent**
   - Universal Event Tracking (UET) integration
   - Consent-aware tracking (only fires if accepted)
   - pageLoad event fires automatically on consent
   - Real-time UET events display section
   - Custom event tracking on user interactions
   - Visual status indicators (initializing/ready/error)
   - Event history with timestamps and details
   - Consent events tracked and displayed

6. **Tracking Integration**
   - Automatic page view tracking
   - API health check on page load
   - Console logging for debugging
   - Visual feedback for API status

7. **Smart API Configuration**
   - Detects local development (localhost/127.0.0.1)
   - Uses `http://localhost:7071/api` for local
   - Uses `/api` for production (Azure Static Web Apps)

### Backend API (`/api`)

#### Endpoints

**1. POST /api/track**
- **Purpose**: Track user events (page views, clicks, custom events)
- **Request Body**:
  ```json
  {
    "eventType": "string",  // Required: e.g., "page_view", "button_click"
    "data": {               // Optional: additional event metadata
      "key": "value"
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "eventId": "1703251200000",
    "message": "Event tracked successfully"
  }
  ```
- **Features**:
  - CORS enabled
  - Input validation
  - Automatic metadata capture (IP, User-Agent, timestamp)
  - In-memory storage (last 100 events)

**2. GET /api/health**
- **Purpose**: Check API health status
- **Response**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2025-12-22T12:00:00.000Z",
    "version": "1.0.0",
    "service": "tracking-api"
  }
  ```

**3. POST /api/humorize**
- **Purpose**: Generate humorous reinterpretation with AI-generated image
- **AI Model**: gpt-5-nano (basic, fast responses)
- **Request Body**:
  ```json
  {
    "text": "string"  // Required: User text (max 1000 chars)
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "originalText": "I love my job",
    "humorousText": "Ah yes, 'I love my job'...",
    "timestamp": "2025-12-22T12:00:00.000Z"
  }
  ```
- **Features**:
  - **Text Generation**: Azure OpenAI (gpt-5-nano) or mock responses
  - 3-5 sentence humorous responses
  - Light, friendly, ironic tone
  - Input validation (max 1000 characters)
  - CORS enabled
  - No image generation (now handled by separate endpoint)

**4. POST /api/generate-image** 🆕
- **Purpose**: Generate AI images separately from text (two-step generation)
- **Request Body**:
  ```json
  {
    "text": "string"  // Greeting text to visualize
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/...",
    "usedAI": true,
    "timestamp": "2025-12-23T10:00:00.000Z"
  }
  ```
- **Features**:
  - **Image Generation**: DALL-E 3 (AI mode) or DiceBear avatars (fallback)
  - 60-second timeout for DALL-E requests
  - Automatic fallback to placeholder on failure
  - 10 fun avatar styles: bottts, avataaars, big-ears, croodles, fun-emoji, lorelei, micah, miniavs, notionists, personas
  - Colorful, unique images for each generation
  - CORS enabled
  - Better UX: Text shows immediately, image loads after

**5. POST /api/family-greeting** 🆕
- **Purpose**: Generate personalized funny New Year stories for family members
- **AI Model**: gpt-4.1 (more creative, better quality than gpt-5-nano)
- **Request Body**:
  ```json
  {
    "wish": "string"  // Required: User wish starting with "В следующем году я хочу"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "greeting": "Смешная история про члена семьи...",
    "familyMember": "Тая",
    "usedAI": true,
    "timestamp": "2025-12-23T10:00:00.000Z"
  }
  ```
- **Features**:
  - Random selection from 5 family members
  - Highly detailed personal descriptions (hobbies, habits, quirks)
  - Generates 400-500 character funny stories
  - Stories show HOW person will achieve their goal (personalized humor)
  - Uses gpt-4.1 with max_tokens: 800, temperature: 0.8
  - Mock fallback when AI unavailable
  - Russian language only
  - CORS enabled

**6. GET /api/config-check** 🆕
- **Purpose**: Diagnostic endpoint to verify environment variables
- **Response**:
  ```json
  {
    "endpoint": "configured: https://ai-for-landing.openai.azure.com",
    "key": "configured: sk-...abc123",
    "deployment": "gpt-5-nano",
    "timestamp": "2025-12-23T10:00:00.000Z"
  }
  ```
- **Features**:
  - Shows which Azure OpenAI variables are set
  - Previews first/last characters of sensitive values
  - Helps debug AI integration issues
  - CORS enabled

**Old Entry: GET /api/health**
- **Purpose**: Check API health status
- **Response**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2025-12-22T12:00:00.000Z",
    "version": "1.0.0",
    "service": "tracking-api"
  }
  ```

## Key Implementation Details

### API Event Flow
1. User loads page → `trackPageView()` called → POST to `/api/track`
2. User clicks button → `trackButtonClick()` called → POST to `/api/track`
3. All events logged to console with success/failure status
4. Visual indicator shows API health (green ✓ or orange ⚠️)

### Current Limitations
- **In-memory storage**: Events are stored in memory only (lost on restart)
- **No persistence**: Data not saved to database
- **No authentication**: API is publicly accessible
- **No rate limiting**: Can be called unlimited times

### Security Considerations
- CORS set to `*` (allows all origins)
- No API keys required
- No input sanitization (basic validation only)
- Suitable for testing/demo purposes only

## Deployment Status

### Completed
✅ Local project created  
✅ GitHub repository created (Kaburum/tracking-test-landing)  
✅ All code committed and pushed to main branch  
✅ GitHub Desktop configured  
✅ Repository migrated to new GitHub account  
✅ Azure Static Web App deployed  
✅ Azure Functions v3 model implemented  
✅ Bing UET tracking integrated  
✅ AI Humor Generator feature added  
✅ GitHub Actions CI/CD configured  

### Required Configuration
When creating Azure Static Web App:
- **Resource Group**: `rg-tracking-landing` (or similar)
- **App location**: `/`
- **Api location**: `api` ⚠️ **CRITICAL - Must be set correctly**
- **Output location**: `/`
- **Plan type**: Free
- **GitHub Organization**: Kaburum
- **Repository**: tracking-test-landing
- **Branch**: main

### Next Steps
1. Complete Azure Static Web App creation
2. Verify GitHub Actions workflow created (`.github/workflows/`)
3. Wait for initial deployment (~2-3 minutes)
4. Test deployed site at `https://<app-name>.azurestaticapps.net`
5. Verify API endpoints work in production
6. Enable custom domain (optional)

## Testing Checklist

### Local Testing
- [ ] Open `index.html` in browser
- [ ] Check console for API URL detection
- [ ] Verify page view tracked on load
- [ ] Click "Get Started" button
- [ ] Verify button click tracked
- [ ] Check API health status indicator

### Production Testing (After Azure Deployment)
- [ ] Visit Azure URL
- [ ] Open browser DevTools (F12)
- [ ] Check console for tracking events
- [ ] Verify API responses (200 status)
- [ ] Test `/api/health` endpoint directly
- [ ] Test `/api/track` with custom events
- [ ] Verify CORS works from different domains

## Future Enhancements

### High Priority
- Add persistent storage (Azure Table Storage or Cosmos DB) for tracking events
- Implement authentication (API keys or Azure AD)
- Add rate limiting to prevent abuse on AI endpoint
- Enhanced input sanitization for AI prompts
- Cost monitoring for Azure OpenAI usage

### Medium Priority
- Analytics dashboard to view tracked events
- Multiple pages for navigation tracking tests
- Form submission tracking examples
- User session tracking with cookies
- AI humor customization (tone, length, style)
- Export/download humor results
- Share generated humor on social media

### Low Priority
- Custom domain setup
- Azure Application Insights integration
- Automated testing (unit + integration)
- Performance monitoring
- A/B testing capabilities
- Multi-language humor support
- Humor favorites/bookmarking

## Development Environment

### Tools Used
- **Editor**: VS Code
- **Version Control**: GitHub Desktop + Git CLI
- **Shell**: PowerShell 5.1 (Windows)
- **Git Location**: `C:\Users\enikitin\AppData\Local\GitHubDesktop\app-3.5.4\resources\app\git\cmd\git.exe`

### Local Development Commands

**Start API Locally** (requires Azure Functions Core Tools):
```powershell
cd api
func start
```

**Open Frontend**:
```powershell
Start-Process index.html
# or
python -m http.server 8000
```

## Important Notes

1. **Azure Functions v3 Model**: Uses v3 programming model (module.exports) for Azure Static Web Apps compatibility. Extension bundle set to `[3.*, 4.0.0)`.

2. **API Location Critical**: The `api` folder location setting in Azure Static Web Apps must be set to `api` (not `/api` or `./api`) for the backend to work.

3. **CORS Configuration**: Currently allows all origins (`*`). Restrict in production.

4. **In-Memory Storage**: Current implementation stores events in memory. They will be lost when Azure Functions scale to zero or restart. Add persistent storage for production use.

5. **No Database**: No database connection configured yet. Events are not persisted.

6. **AI Humor Generator Modes**:
   - **AI Mode**: Requires Azure OpenAI configuration (endpoint, key, deployment)
   - **Mock Mode**: Uses pre-written templates when AI is not configured
   - Automatically falls back to mock if AI fails

7. **Bing UET Tag ID**: Currently configured with tag ID `97220626`. Update in index.html for your own tracking.

8. **Cookie Consent & Privacy**:
   - Cookie banner shown on first visit
   - Consent stored in localStorage
   - UET only loads after user consent
   - Consent state synced with UET tracking
   - Compliant with privacy regulations

8. **Free Tier Limits**: Azure Static Web Apps free tier includes:
   - 100 GB bandwidth/month
   - 2 custom domains
   - Unlimited API calls
   - No SLA

## Git Repository Details

- **Current Branch**: main
- **Remote Origin**: https://github.com/Kaburum/tracking-test-landing.git
- **Last Commit**: "Add cookie consent banner with UET consent management"
- **Files Tracked**: 15+ files
  - Frontend: index.html
  - Documentation: README.md, PROJECT_CONTEXT.md, API.md
  - API Functions: track, health, humorize
  - Configuration: host.json, function.json files

## Contact & Resources

- **Repository**: https://github.com/Kaburum/tracking-test-landing
- **API Documentation**: See `api/API.md`
- **Azure Portal**: https://portal.azure.com

---

## For Next Iteration

Use this context to understand the current state of the project. The codebase is complete and functional with all features deployed and operational.

**Current Status**: ✅ **DEPLOYED & OPERATIONAL**
- Azure Static Web App configured and running
- All API endpoints functional (track, health, humorize)
- Bing UET tracking active with cookie consent
- AI Humor Generator with image generation operational
- Cookie consent banner managing privacy compliance
- GitHub Actions CI/CD pipeline active

**Optional Configuration**:
- Add Azure OpenAI credentials to enable AI-powered humor + DALL-E 3 images
- Customize UET tag ID for your own Bing Ads account
- Add persistent storage for tracking events
- Customize cookie consent text/styling

**Recent Changes** (Dec 23, 2025):
1. Fixed Azure Functions compatibility (v4 → v3 model)
2. Added Bing UET tracking with real-time event display
3. Implemented AI Humor Generator with dual-mode operation
4. **Added AI-powered image generation** (DALL-E 3 + fun avatars)
5. **Implemented cookie consent banner** with UET consent management
6. Simplified page layout (removed feature cards, moved humor to top)
7. Enhanced placeholder images with 10 playful cartoon styles
8. Added fun title "Welcome to the Best Website Ever"
9. Integrated UET consent state management (grant/deny)
10. **Created family New Year greetings page** (`/kids.html`) in Russian
11. **Implemented two-step generation** (text first, then image separately)
12. **Switched to gpt-4.1** for family greetings (better creativity)
13. Added extensive family member descriptions (hobbies, habits, quirks)
14. Configured separate DALL-E 3 image generation endpoint
15. Updated default input to "В следующем году я хочу " for kids page
16. Enhanced AI prompts for story-based output (400-500 chars)
17. Removed family greetings link from main page (direct access only)
18. Added diagnostic config-check endpoint for troubleshooting

### Azure OpenAI Configuration
**Required Environment Variables** (set in Azure Static Web Apps):
- `AZURE_OPENAI_ENDPOINT`: https://ai-for-landing.openai.azure.com
- `AZURE_OPENAI_KEY`: Your Azure OpenAI API key
- `AZURE_OPENAI_DEPLOYMENT`: gpt-4.1 (or gpt-5-nano for main page)

**Deployed Models**:
- **gpt-5-nano**: Fast, basic responses for main humor generator
- **gpt-4.1**: Creative, detailed stories for family greetings
- **dall-e-3**: AI image generation (optional, falls back to avatars)
