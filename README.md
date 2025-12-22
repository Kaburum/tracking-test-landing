# Tracking Test Landing Page

A simple HTML landing page with backend API designed for testing JavaScript tracking implementations.

## Features

- Clean, modern design with gradient background
- Responsive layout that works on all devices
- Interactive button for testing click tracking
- **Backend API** with Azure Functions for storing tracking events
- Real-time tracking with API integration
- Console logging for debugging tracking events
- Health check endpoint for API monitoring

## Getting Started

### Local Development

Simply open `index.html` in your browser:

```powershell
# Open with default browser
Start-Process index.html
```

Or use a local web server:

```powershell
# Using Python
python -m http.server 8000

# Using Node.js (with http-server package)
npx http-server
```

Then visit `http://localhost:8000` in your browser.

### Adding Your Tracking Code

1. Open `index.html`
2. Find the `<script>` section near the bottom of the file
3. Replace the placeholder functions with your actual tracking implementation

Example with a common tracking library:

```javascript
// Example: Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'YOUR-TRACKING-ID');

function trackPageView() {
    gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
}

function trackButtonClick(buttonName) {
    gtag('event', 'click', {
        event_category: 'engagement',
        event_label: buttonName
    });
}
```

## Testing Tracking Events

1. Open the page in your browser
2. Open browser Developer Tools (F12)
3. Go to the Console tab
4. Click the "Get Started" button
5. Observe tracking events in the console

## Deployment

### Azure Static Web Apps (Recommended)

Azure Static Web Apps automatically deploys both frontend and backend:

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a **Static Web App** resource
3. Connect to your GitHub repository
4. Configure build settings:
   - **App location**: `/`
   - **Api location**: `api`
   - **Output location**: `/`
5. Azure will create a GitHub Actions workflow that:
   - Deploys your HTML frontend
   - Deploys your Azure Functions API
   - Provides a single URL for everything

Your site will be available at: `https://your-app.azurestaticapps.net`

### GitHub Pages (Frontend Only)

For frontend-only hosting (no API):

1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select branch (usually `main`) and root folder
4. Your site will be available at `https://yourusername.github.io/repository-name`

**Note:** API endpoints won't work on GitHub Pages. Use Azure Static Web Apps for full functionality.

## Project Structure

```
tracking-test-landing/
├── index.html          # Main landing page with tracking integration
├── api/                # Backend API (Azure Functions)
│   ├── host.json       # Azure Functions configuration
│   ├── package.json    # Node.js dependencies
│   ├── track/          # Track events endpoint
│   │   ├── function.json
│   │   └── index.js
│   └── health/         # Health check endpoint
│       ├── function.json
│       └── index.js
└── README.md          # This file
```

## Backend API

The project includes a serverless backend API built with Azure Functions.

### Endpoints

#### POST /api/track
Track user events (page views, clicks, etc.)

**Request:**
```json
{
  "eventType": "page_view",
  "data": {
    "url": "https://example.com",
    "referrer": "https://google.com",
    "screenWidth": 1920,
    "screenHeight": 1080
  }
}
```

**Response:**
```json
{
  "success": true,
  "eventId": "1703251200000",
  "message": "Event tracked successfully"
}
```

#### GET /api/health
Check API health status

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-22T12:00:00.000Z",
  "version": "1.0.0",
  "service": "tracking-api"
}
```

## Local Development

### Frontend Only

Simply open `index.html` in your browser:

```powershell
# Open with default browser
Start-Process index.html
```

### With Backend API

1. **Install Azure Functions Core Tools:**
   ```powershell
   npm install -g azure-functions-core-tools@4
   ```

2. **Start the API locally:**
   ```powershell
   cd api
   func start
   ```
   The API will run on `http://localhost:7071`

3. **Open the frontend:**
   - Open `index.html` in your browser
   - Or use a local web server:
     ```powershell
     python -m http.server 8000
     ```
   - Visit `http://localhost:8000`

The frontend automatically detects if it's running locally and uses the correct API URL.

## Future Enhancements

- Add database storage (Azure Table Storage or Cosmos DB) for persisting events
- Add more interactive elements for testing different event types
- Create separate pages for testing navigation tracking
- Add form submission tracking examples
- Implement user authentication
- Add analytics dashboard to view tracked events
- Support for custom tracking parameters

## License

MIT License - Feel free to use this for testing purposes!
