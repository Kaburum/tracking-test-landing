// Diagnostic endpoint to check environment variables
module.exports = async function (context, req) {
    context.log('Config check endpoint called');

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
        return;
    }

    // Check environment variables (without exposing sensitive values)
    const hasEndpoint = !!process.env.AZURE_OPENAI_ENDPOINT;
    const hasKey = !!process.env.AZURE_OPENAI_KEY;
    const hasDeployment = !!process.env.AZURE_OPENAI_DEPLOYMENT;

    const endpointValue = process.env.AZURE_OPENAI_ENDPOINT 
        ? process.env.AZURE_OPENAI_ENDPOINT.substring(0, 30) + '...' 
        : 'NOT SET';
    const keyValue = process.env.AZURE_OPENAI_KEY 
        ? process.env.AZURE_OPENAI_KEY.substring(0, 10) + '...' 
        : 'NOT SET';
    const deploymentValue = process.env.AZURE_OPENAI_DEPLOYMENT || 'NOT SET';

    context.res = {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: {
            success: true,
            environmentVariables: {
                AZURE_OPENAI_ENDPOINT: {
                    configured: hasEndpoint,
                    preview: endpointValue
                },
                AZURE_OPENAI_KEY: {
                    configured: hasKey,
                    preview: keyValue
                },
                AZURE_OPENAI_DEPLOYMENT: {
                    configured: hasDeployment,
                    value: deploymentValue
                }
            },
            allConfigured: hasEndpoint && hasKey && hasDeployment,
            timestamp: new Date().toISOString()
        }
    };
};
