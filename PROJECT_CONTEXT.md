# Project Context for LLM

## Project Overview

**Project Name**: Tracking Test Landing Page  
**GitHub Repository**: https://github.com/Kaburum/tracking-test-landing  
**Purpose**: A simple HTML landing page with backend API designed for testing JavaScript tracking implementations  
**Status**: Codebase complete and pushed to GitHub. Azure Static Web App deployment in progress.

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
    └── health/             # Health check endpoint
        ├── function.json   # Function configuration
        └── index.js        # GET /api/health implementation
```

## Technology Stack

### Frontend
- **Pure HTML/CSS/JavaScript** (no frameworks)
- Responsive design with gradient background
- Vanilla JavaScript for tracking implementation
- Automatic API URL detection (local vs production)

### Backend
- **Azure Functions** (Node.js v4 programming model)
- Serverless architecture
- RESTful API endpoints
- CORS enabled for cross-origin requests

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

3. **Smart API Configuration**
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

### In Progress
🔄 Azure Static Web App resource being created  
🔄 GitHub connection being authorized  

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

## Future Enhancements (Not Yet Implemented)

### High Priority
- Add persistent storage (Azure Table Storage or Cosmos DB)
- Implement authentication (API keys or Azure AD)
- Add rate limiting to prevent abuse
- Input validation and sanitization
- Error handling improvements

### Medium Priority
- Analytics dashboard to view tracked events
- Multiple pages for navigation tracking tests
- Form submission tracking examples
- User session tracking
- Custom event parameters

### Low Priority
- Custom domain setup
- Azure Application Insights integration
- Automated testing (unit + integration)
- Performance monitoring
- A/B testing capabilities

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

1. **API Location Critical**: The `api` folder location setting in Azure Static Web Apps must be set to `api` (not `/api` or `./api`) for the backend to work.

2. **CORS Configuration**: Currently allows all origins (`*`). Restrict in production.

3. **In-Memory Storage**: Current implementation stores events in memory. They will be lost when Azure Functions scale to zero or restart. Add persistent storage for production use.

4. **No Database**: No database connection configured yet. Events are not persisted.

5. **Free Tier Limits**: Azure Static Web Apps free tier includes:
   - 100 GB bandwidth/month
   - 2 custom domains
   - Unlimited API calls
   - No SLA

## Git Repository Details

- **Current Branch**: main
- **Remote Origin**: https://github.com/Kaburum/tracking-test-landing.git
- **Last Commit**: "Add backend API with Azure Functions"
- **Files Tracked**: 9 files (7 API files, 2 frontend files)

## Contact & Resources

- **Repository**: https://github.com/Kaburum/tracking-test-landing
- **API Documentation**: See `api/API.md`
- **Azure Portal**: https://portal.azure.com

---

## For Next Iteration

Use this context to understand the current state of the project. The codebase is complete and functional. The main task remaining is to complete the Azure Static Web App deployment and verify everything works in production.

**Current Status**: Awaiting Azure Static Web App configuration completion. All code is ready and pushed to GitHub.
