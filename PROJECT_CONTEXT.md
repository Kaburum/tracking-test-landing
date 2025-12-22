# Project Context for LLM

## Project Overview

**Project Name**: Tracking Test Landing Page  
**GitHub Repository**: https://github.com/Kaburum/tracking-test-landing  
**Purpose**: A simple HTML landing page with backend API designed for testing JavaScript tracking implementations and AI-powered humor generation  
**Status**: Deployed to Azure Static Web Apps. All features operational.

## Project Structure

```
tracking-test-landing/
├── index.html              # Main landing page with tracking integration
├── README.md               # Project documentation
├── .gitignore              # Git ignore rules
├── PROJECT_CONTEXT.md      # This file
└── api/                    # Backend API (Azure Functions)
    ├── host.json           # Azure Functions configuration
    ├── package.json        # Node.js dependencies
    ├── API.md              # API documentation
    ├── track/              # Track events endpoint
    │   ├── function.json   # Function configuration
    │   └── index.js        # POST /api/track implementation
    ├── health/             # Health check endpoint
    │   ├── function.json   # Function configuration
    │   └── index.js        # GET /api/health implementation
    └── humorize/           # AI humor generator endpoint
        ├── function.json   # Function configuration
        └── index.js        # POST /api/humorize implementation
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
- Azure OpenAI integration (optional)

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
1. **Modern Landing Page Design**
   - Gradient purple background
   - Responsive grid layout
   - Interactive "Get Started" button
   - Three feature cards
   - Tracking status indicator (bottom right)

2. **Tracking Integration**
   - Automatic page view tracking on load
   - Button click tracking
   - API health check on page load
   - Console logging for debugging
   - Visual feedback for API status

3. **Bing UET Tracking** 🆕
   - Universal Event Tracking (UET) integration
   - Real-time UET events display section
   - Custom event tracking on user interactions
   - Visual status indicators (initializing/ready/error)
   - Event history with timestamps and details

4. **AI Humor Generator** 🆕
   - Text input area (up to 1000 characters)
   - AI-powered humorous text reinterpretation
   - One-click generation and regeneration
   - Loading animations and error handling
   - Uses Azure OpenAI or mock responses
   - Tracks humor generation events via UET

5. **Smart API Configuration**
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

**3. POST /api/humorize** 🆕
- **Purpose**: Generate humorous reinterpretation of user text
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
  - Azure OpenAI integration (GPT-3.5/4)
  - Fallback to mock humorous responses
  - 3-5 sentence responses
  - Light, friendly, ironic tone
  - Input validation (max 1000 characters)
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

8. **Free Tier Limits**: Azure Static Web Apps free tier includes:
   - 100 GB bandwidth/month
   - 2 custom domains
   - Unlimited API calls
   - No SLA

## Git Repository Details

- **Current Branch**: main
- **Remote Origin**: https://github.com/Kaburum/tracking-test-landing.git
- **Last Commit**: "Add AI Humor Generator feature with Azure Functions backend"
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
- Bing UET tracking active
- AI Humor Generator operational (mock mode by default)
- GitHub Actions CI/CD pipeline active

**Optional Configuration**:
- Add Azure OpenAI credentials to enable AI-powered humor generation
- Customize UET tag ID for your own Bing Ads account
- Add persistent storage for tracking events

**Recent Changes** (Dec 22, 2025):
1. Fixed Azure Functions compatibility (v4 → v3 model)
2. Added Bing UET tracking with real-time event display
3. Implemented AI Humor Generator with dual-mode operation
4. Updated all documentation (README, API.md, PROJECT_CONTEXT.md)
