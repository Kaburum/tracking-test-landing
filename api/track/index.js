// In-memory storage for demo purposes
// In production, you'd use Azure Table Storage, Cosmos DB, or SQL Database
const trackingEvents = [];

module.exports = async function (context, req) {
    context.log('Track event endpoint called');

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
        return;
    }

    try {
        // Get request body
        const body = req.body;
        
        // Validate required fields
        if (!body || !body.eventType) {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    success: false,
                    error: 'eventType is required'
                }
            };
            return;
        }

        // Create tracking event
        const trackingEvent = {
            id: Date.now().toString(),
            eventType: body.eventType,
            timestamp: new Date().toISOString(),
            data: body.data || {},
            userAgent: req.headers['user-agent'] || 'unknown',
            ip: req.headers['x-forwarded-for'] || req.headers['x-client-ip'] || 'unknown'
        };

        // Store event (in production, save to database)
        trackingEvents.push(trackingEvent);
        
        // Keep only last 100 events in memory
        if (trackingEvents.length > 100) {
            trackingEvents.shift();
        }

        context.log('Event tracked:', trackingEvent);

        // Return success response
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                success: true,
                eventId: trackingEvent.id,
                message: 'Event tracked successfully'
            }
        };

    } catch (error) {
        context.log('Error tracking event:', error);
        
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                success: false,
                error: 'Failed to track event',
                details: error.message
            }
        };
    }
};
