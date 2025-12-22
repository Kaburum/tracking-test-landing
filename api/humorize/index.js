// Humorize text using AI (Azure OpenAI or mock responses)
// This endpoint takes user text and returns a humorous reinterpretation

module.exports = async function (context, req) {
    context.log('Humorize endpoint called');

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

        const userText = body.text.trim();

        // Validate text length (1-2 paragraphs max)
        if (userText.length > 1000) {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    success: false,
                    error: 'Text is too long. Please keep it under 1000 characters.'
                }
            };
            return;
        }

        // Check for Azure OpenAI configuration
        const useAI = process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_KEY;

        let humorousText;
        let imageUrl = null;

        if (useAI) {
            // Use Azure OpenAI
            humorousText = await generateHumorWithAI(userText, context);
            
            // Generate image based on humorous text
            imageUrl = await generateImageWithAI(humorousText, context);
        } else {
            // Use mock responses (fallback for testing)
            humorousText = generateMockHumor(userText);
            // Use placeholder image
            imageUrl = generatePlaceholderImage(humorousText);
        }

        context.log('Humorous text and image generated');

        // Return success response
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                success: true,
                originalText: userText,
                humorousText: humorousText,
                imageUrl: imageUrl,
                timestamp: new Date().toISOString()
            }
        };

    } catch (error) {
        context.log('Error generating humor:', error);
        
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                success: false,
                error: 'Failed to generate humor. Please try again.',
                details: error.message
            }
        };
    }
};

// Generate humor using Azure OpenAI
async function generateHumorWithAI(text, context) {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_KEY;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-35-turbo';

    const systemPrompt = `You are a witty, sarcastic AI comedian. Your job is to take any text the user provides and reinterpret it in a hilarious, ironic, or absurdly humorous way. 

Rules:
- Keep responses to 3-5 sentences maximum
- Be light-hearted and friendly, never offensive or mean-spirited
- Use humor techniques like: exaggeration, irony, unexpected twists, or playful sarcasm
- Make it genuinely funny and creative
- Avoid sensitive topics, politics, or controversial content
- If the input is already funny, add another layer of humor`;

    const userPrompt = `Reinterpret this text in a hilarious way: "${text}"`;

    try {
        const response = await fetch(`${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-15-preview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 200,
                temperature: 0.9,
                top_p: 0.95
            })
        });

        if (!response.ok) {
            throw new Error(`Azure OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();

    } catch (error) {
        context.log('Azure OpenAI error:', error);
        // Fallback to mock humor if AI fails
        return generateMockHumor(text);
    }
}

// Generate mock humorous responses (fallback)
function generateMockHumor(text) {
    const humorTemplates = [
        `"${text.substring(0, 50)}..." - That's what they all say right before disaster strikes. Classic rookie mistake.`,
        `Ah yes, "${text.substring(0, 50)}..." The eternal battle cry of someone who's about to learn a valuable life lesson the hard way.`,
        `Scientists have studied your statement "${text.substring(0, 50)}..." for years. Their conclusion? It's definitely words arranged in an order.`,
        `Breaking news: Local person claims "${text.substring(0, 50)}..." More at 11, but spoiler alert - nobody believes them.`,
        `Your text radiates the same energy as a motivational poster hanging in a dentist's waiting room. Inspiring? Maybe. Believable? That's debatable.`,
        `I've seen fortune cookies with more specific advice than "${text.substring(0, 50)}..." At least the cookies come with free dinner.`,
        `Historians will look back at "${text.substring(0, 50)}..." and think "Wow, they really thought that would work." Spoiler: it didn't.`,
        `That statement has the same confidence as someone ordering a salad at a burger restaurant. Bold move, questionable execution.`,
        `Your words suggest a level of optimism typically only found in people who've never experienced Mondays. Bless your heart.`,
        `Philosophers have pondered "${text.substring(0, 50)}..." and concluded that reality called - it wants its expectations back.`
    ];

    // Select a random template
    const randomIndex = Math.floor(Math.random() * humorTemplates.length);
    return humorTemplates[randomIndex];
}

// Generate image using Azure OpenAI DALL-E
async function generateImageWithAI(humorText, context) {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_KEY;

    // Create a safe, descriptive prompt for image generation
    const imagePrompt = `Create a humorous, cartoon-style illustration representing this concept: ${humorText.substring(0, 200)}. Style: colorful, playful, funny, suitable for all ages.`;

    try {
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
            })
        });

        if (!response.ok) {
            throw new Error(`DALL-E API error: ${response.status}`);
        }

        const data = await response.json();
        return data.data[0].url;

    } catch (error) {
        context.log('DALL-E error:', error);
        // Fallback to placeholder if AI image generation fails
        return generatePlaceholderImage(humorText);
    }
}

// Generate placeholder image URL (fallback)
function generatePlaceholderImage(humorText) {
    // Use a fun placeholder service with text overlay
    const encodedText = encodeURIComponent('😂 AI Humor');
    const colors = ['FF6B6B', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E2'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Using placeholder.com with custom text and color
    return `https://via.placeholder.com/1024x1024/${randomColor}/FFFFFF?text=${encodedText}`;
}
