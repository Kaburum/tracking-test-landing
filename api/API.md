# API Documentation

## Overview

The Tracking API is a serverless backend built with Azure Functions that provides endpoints for tracking user events and monitoring API health.

## Base URL

- **Local Development**: `http://localhost:7071/api`
- **Production**: `https://your-app.azurestaticapps.net/api`

## Endpoints

### Track Event

Track user interactions and events.

**Endpoint**: `POST /api/track`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "eventType": "string",     // Required: Type of event (e.g., "page_view", "button_click")
  "data": {                  // Optional: Additional event data
    "key": "value"
  }
}
```

**Example Request**:
```javascript
fetch('/api/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    eventType: 'button_click',
    data: {
      buttonName: 'Get Started',
      url: window.location.href,
      timestamp: new Date().toISOString()
    }
  })
});
```

**Success Response** (200):
```json
{
  "success": true,
  "eventId": "1703251200000",
  "message": "Event tracked successfully"
}
```

**Error Response** (400):
```json
{
  "success": false,
  "error": "eventType is required"
}
```

**Error Response** (500):
```json
{
  "success": false,
  "error": "Failed to track event"
}
```

### Health Check

Check if the API is running and healthy.

**Endpoint**: `GET /api/health`

**Example Request**:
```javascript
fetch('/api/health')
  .then(response => response.json())
  .then(data => console.log(data));
```

**Success Response** (200):
```json
{
  "status": "healthy",
  "timestamp": "2025-12-22T12:00:00.000Z",
  "version": "1.0.0",
  "service": "tracking-api"
}
```

## Event Types

Common event types you can track:

- `page_view` - When a page is loaded
- `button_click` - When a button is clicked
- `form_submit` - When a form is submitted
- `link_click` - When a link is clicked
- `scroll` - When user scrolls
- `error` - When an error occurs
- Custom event types as needed

## CORS

CORS is enabled for all origins (`*`) to allow testing from any domain. In production, you should restrict this to specific domains.

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

## Data Storage

**Current Implementation**: In-memory storage (for demo purposes only)
- Events are stored in memory
- Only the last 100 events are kept
- Data is lost when the function restarts

**Production Recommendations**:
- Use Azure Table Storage for simple, cost-effective storage
- Use Azure Cosmos DB for advanced querying and analytics
- Use Azure SQL Database for relational data needs

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (missing required fields)
- `500` - Internal Server Error

Errors include a JSON response with an `error` field describing the issue.

## Security Considerations

For production use, consider:

1. **Authentication**: Add API keys or Azure AD authentication
2. **CORS**: Restrict to specific domains
3. **Rate Limiting**: Prevent abuse
4. **Input Validation**: Validate and sanitize all input data
5. **Data Storage**: Use secure, persistent storage
6. **Monitoring**: Enable Application Insights for monitoring
7. **Secrets**: Store sensitive data in Azure Key Vault

## Monitoring

The API automatically logs to Azure Application Insights when deployed. You can view:
- Request volume and latency
- Error rates
- Custom log messages
- Performance metrics

## Local Testing

Use tools like:
- **Browser Console**: `fetch()` API
- **Postman**: For API testing
- **curl**: Command-line testing

Example curl command:
```bash
curl -X POST http://localhost:7071/api/track \
  -H "Content-Type: application/json" \
  -d '{"eventType":"test","data":{"source":"curl"}}'
```

## Example Usage in Frontend

```javascript
// Track page view
async function trackPageView() {
  await fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'page_view',
      data: {
        url: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      }
    })
  });
}

// Track button click
async function trackClick(buttonName) {
  await fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'button_click',
      data: { buttonName }
    })
  });
}

// Check API health
async function checkHealth() {
  const response = await fetch('/api/health');
  const health = await response.json();
  console.log('API Status:', health.status);
}
```
