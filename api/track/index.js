const { app } = require('@azure/functions');

// In-memory storage for demo purposes
// In production, you'd use Azure Table Storage, Cosmos DB, or SQL Database
const trackingEvents = [];

app.http('track', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Track event endpoint called');

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            };
        }

        try {
            // Parse request body
            const body = await request.json();
            
            // Validate required fields
            if (!body.eventType) {
                return {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        success: false,
                        error: 'eventType is required'
                    })
                };
            }

            // Create tracking event
            const trackingEvent = {
                id: Date.now().toString(),
                eventType: body.eventType,
                timestamp: new Date().toISOString(),
                data: body.data || {},
                userAgent: request.headers.get('user-agent'),
                ip: request.headers.get('x-forwarded-for') || 'unknown'
            };

            // Store event (in production, save to database)
            trackingEvents.push(trackingEvent);
            
            // Keep only last 100 events in memory
            if (trackingEvents.length > 100) {
                trackingEvents.shift();
            }

            context.log('Event tracked:', trackingEvent);

            // Return success response
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: true,
                    eventId: trackingEvent.id,
                    message: 'Event tracked successfully'
                })
            };

        } catch (error) {
            context.log('Error tracking event:', error);
            
            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: false,
                    error: 'Failed to track event'
                })
            };
        }
    }
});
