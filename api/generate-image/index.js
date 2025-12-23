// Generate image from text using DALL-E 3
module.exports = async function (context, req) {
    context.log('Generate image endpoint called');

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
        const body = req.body;
        
        if (!body || !body.text) {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    success: false,
                    error: 'Text is required'
                }
            };
            return;
        }

        const text = body.text.trim();
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_KEY;

        let imageUrl;
        let usedAI = false;

        if (endpoint && apiKey) {
            try {
                context.log('Generating image with DALL-E 3...');
                imageUrl = await generateImageWithDALLE(text, endpoint, apiKey, context);
                usedAI = true;
                context.log('Image generated successfully');
            } catch (error) {
                context.log('DALL-E failed, using placeholder:', error.message);
                imageUrl = generatePlaceholderImage(text);
                usedAI = false;
            }
        } else {
            context.log('Azure OpenAI not configured, using placeholder');
            imageUrl = generatePlaceholderImage(text);
            usedAI = false;
        }

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                success: true,
                imageUrl: imageUrl,
                usedAI: usedAI,
                timestamp: new Date().toISOString()
            }
        };

    } catch (error) {
        context.log('Error generating image:', error);
        
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                success: false,
                error: 'Failed to generate image',
                details: error.message
            }
        };
    }
};

// Generate image using DALL-E 3
async function generateImageWithDALLE(text, endpoint, apiKey, context) {
    const imagePrompt = `Create a humorous, cartoon-style illustration representing this concept: ${text.substring(0, 200)}. Style: colorful, playful, funny, suitable for all ages.`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        
        const response = await fetch(`${endpoint}/openai/deployments/dall-e-3/images/generations?api-version=2024-02-01`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify({
                prompt: imagePrompt,
                n: 1,
                size: '1024x1024',
                quality: 'standard',
                style: 'vivid'
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            context.log('DALL-E error response:', errorText);
            throw new Error(`DALL-E API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        context.log('DALL-E image URL:', data.data[0].url);
        return data.data[0].url;

    } catch (error) {
        context.log('DALL-E error:', error.message);
        throw error;
    }
}

// Generate placeholder image
function generatePlaceholderImage(text) {
    const seed = encodeURIComponent(text.substring(0, 30));
    
    const diceBearStyles = [
        'bottts', 'avataaars', 'big-ears', 'croodles', 'fun-emoji',
        'lorelei', 'micah', 'miniavs', 'notionists', 'personas'
    ];
    
    const randomStyle = diceBearStyles[Math.floor(Math.random() * diceBearStyles.length)];
    const colors = ['b6e3f4', 'c0aede', 'ffd5dc', 'ffdfbf', 'd1f4dd', 'ffeaa7', 'fab1a0', 'a29bfe'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}&backgroundColor=${randomColor}&size=1024`;
}
