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
        const hasEndpoint = !!process.env.AZURE_OPENAI_ENDPOINT;
        const hasKey = !!process.env.AZURE_OPENAI_KEY;
        const useAI = hasEndpoint && hasKey;

        context.log('=== AI Configuration Status ===');
        context.log('AZURE_OPENAI_ENDPOINT configured:', hasEndpoint);
        context.log('AZURE_OPENAI_KEY configured:', hasKey);
        context.log('Using AI models:', useAI);
        context.log('==============================');

        let humorousText;
        let imageUrl = null;
        let usedAI = false;

        if (useAI) {
            try {
                context.log('Attempting to generate humor with Azure OpenAI...');
                humorousText = await generateHumorWithAI(userText, context);
                context.log('Humor generated successfully with AI');
                usedAI = true;
                
                // Generate image based on humorous text
                context.log('Attempting to generate image with DALL-E...');
                imageUrl = await generateImageWithAI(humorousText, context);
                context.log('Image generated with AI');
            } catch (error) {
                context.log('❌ AI generation failed, using fallback');
                context.log('Error details:', {
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                });
                humorousText = generateMockHumor(userText);
                imageUrl = generatePlaceholderImage(humorousText);
                usedAI = false;
                
                // Store error for debugging
                this.lastError = {
                    message: error.message,
                    name: error.name
                };
            }
        } else {
            // Use mock responses (fallback for testing)
            context.log('AI not configured, using mock responses');
            context.log('To enable AI: Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY in Azure Function App Settings');
            humorousText = generateMockHumor(userText);
            // Use placeholder image
            imageUrl = generatePlaceholderImage(humorousText);
        }

        context.log('Humorous text generated:', humorousText.substring(0, 50));
        context.log('Image URL generated:', imageUrl);

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
                imageUrl: imageUrl,,
                    lastError: this.lastError || null
                usedAI: usedAI,
                timestamp: new Date().toISOString(),
                debug: {
                    endpoint: process.env.AZURE_OPENAI_ENDPOINT ? 'set' : 'not set',
                    key: process.env.AZURE_OPENAI_KEY ? 'set' : 'not set',
                    deployment: process.env.AZURE_OPENAI_DEPLOYMENT || 'not set'
                }
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
        context.log('Calling Azure OpenAI:', `${endpoint}/openai/deployments/${deploymentName}/...`);
        
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
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
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            context.log('Azure OpenAI error response:', errorText);
            throw new Error(`Azure OpenAI API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        context.log('Azure OpenAI response received successfully');
        return data.choices[0].message.content.trim();

    } catch (error) {
        context.log('Azure OpenAI error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        // Fallback to mock humor if AI fails
        throw error; // Re-throw to be handled by main try-catch
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
        context.log('Calling DALL-E 3 for image generation...');
        
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for image generation
        
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
        context.log('DALL-E image generated successfully:', data.data[0].url);
        return data.data[0].url;

    } catch (error) {
        context.log('DALL-E error details:', {
            message: error.message,
            name: error.name
        });
        // Fallback to placeholder if AI image generation fails
        context.log('Falling back to placeholder image');
        return generatePlaceholderImage(humorText);
    }
}

// Generate placeholder image URL (fallback)
function generatePlaceholderImage(humorText) {
    // Use multiple fun and engaging placeholder services
    const seed = encodeURIComponent(humorText.substring(0, 30));
    
    // Fun DiceBear avatar styles (more playful than 'shapes')
    const diceBearStyles = [
        'bottts',        // Fun robots
        'avataaars',     // Cartoon people
        'big-ears',      // Cute characters with big ears
        'croodles',      // Doodle-style characters
        'fun-emoji',     // Emoji-based avatars
        'lorelei',       // Illustrated characters
        'micah',         // Diverse illustrated people
        'miniavs',       // Cute mini characters
        'notionists',    // Notion-style avatars
        'personas'       // Character personas
    ];
    
    const randomStyle = diceBearStyles[Math.floor(Math.random() * diceBearStyles.length)];
    
    const colors = ['b6e3f4', 'c0aede', 'ffd5dc', 'ffdfbf', 'd1f4dd', 'ffeaa7', 'fab1a0', 'a29bfe'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Return fun avatar with random style
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}&backgroundColor=${randomColor}&size=1024`;
}
