# Tracking Test Landing Page

A simple HTML landing page designed for testing JavaScript tracking implementations.

## Features

- Clean, modern design with gradient background
- Responsive layout that works on all devices
- Interactive button for testing click tracking
- Console logging for debugging tracking events
- Easy to integrate with any tracking library

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

### GitHub Pages

1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select branch (usually `main`) and root folder
4. Your site will be available at `https://yourusername.github.io/repository-name`

### Other Hosting Options

- **Netlify**: Drag and drop the folder or connect your GitHub repo
- **Vercel**: Import your GitHub repository
- **Azure Static Web Apps**: Deploy directly from GitHub
- **AWS S3**: Upload files to S3 bucket with static website hosting enabled

## Project Structure

```
tracking-test-landing/
├── index.html          # Main landing page
└── README.md          # This file
```

## Future Enhancements

- Add more interactive elements for testing different event types
- Create separate pages for testing navigation tracking
- Add form submission tracking examples
- Include backend API for testing server-side tracking

## License

MIT License - Feel free to use this for testing purposes!
