// Generate funny New Year's greeting for family members
module.exports = async function (context, req) {
    context.log('Family greeting endpoint called');

    // Handle CORS
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
        
        if (!body || !body.wish) {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    success: false,
                    error: 'Wish text is required'
                }
            };
            return;
        }

        const wish = body.wish.trim();

        // Family members data
        const familyMembers = [
            {
                name: 'Тая',
                description: '13 лет, девочка, учится в 7 классе, занимается танцами, акробатикой и гимнастикой, любит рисовать. Ее называют Пикми. Любит бардак и есть в комнате. Сложно дается математика.'
            },
            {
                name: 'Сева',
                description: '11 лет, мальчик, учится в 5 классе, очень любит есть разную еду, особенно KFC. Любит играть в игры, может делать это без остановки. Занимается кикбоксингом и играет на гитаре, правда его всегда приходится заставлять играть на гитаре. Учится плохо, постоянно все забывает.'
            },
            {
                name: 'Зоя',
                description: '9 лет, девочка, учится в 3 классе. Занимается гимнастикой, играет на барабанах. Очень любит рисовать, делать поделки и всякие эксперименты.'
            },
            {
                name: 'Арина (мама)',
                description: '37 лет, мама в семье. Любит учиться, хотя иногда ей дается это тяжело, любит бегать а еще иногда очень долго играть в шарики и ферму, но это временно. Постоянно занимается детьми, готовит, убирается, возит их на занятия.'
            },
            {
                name: 'Женя (папа)',
                description: '37 лет, папа в семье, очень много работает, работает менеджером продукта в Майкрософт, бегает и иногда занимается спортом. Любит покупать дорогую одежду и гаджеты.'
            }
        ];

        // Select random family member
        const randomMember = familyMembers[Math.floor(Math.random() * familyMembers.length)];
        context.log('Selected family member:', randomMember.name);

        // Check for Azure OpenAI
        const hasEndpoint = !!process.env.AZURE_OPENAI_ENDPOINT;
        const hasKey = !!process.env.AZURE_OPENAI_KEY;
        const useAI = hasEndpoint && hasKey;

        let greeting;
        let usedAI = false;

        if (useAI) {
            try {
                context.log('Generating greeting with AI...');
                greeting = await generateWithAI(wish, randomMember, context);
                usedAI = true;
                context.log('Greeting generated with AI');
            } catch (error) {
                context.log('AI failed, using mock:', error.message);
                greeting = generateMockGreeting(wish, randomMember);
                usedAI = false;
            }
        } else {
            context.log('AI not configured, using mock');
            greeting = generateMockGreeting(wish, randomMember);
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
                greeting: greeting,
                familyMember: randomMember.name,
                usedAI: usedAI,
                timestamp: new Date().toISOString()
            }
        };

    } catch (error) {
        context.log('Error:', error);
        
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                success: false,
                error: 'Failed to generate greeting',
                details: error.message
            }
        };
    }
};

// Generate greeting with Azure OpenAI
async function generateWithAI(wish, member, context) {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_KEY;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4.1';

    const systemPrompt = `Ты веселый рассказчик семейных историй! Создаешь смешные новогодние истории и шутки про членов семьи.

Твоя задача:
- Придумай забавную историю или шутку (400-500 символов) про конкретного человека
- Используй реальные факты: привычки, хобби, особенности характера
- Обыграй желание пользователя через призму личности этого человека
- Создай смешную ситуацию, как этот человек будет добиваться своей цели
- Пиши живым, разговорным языком с юмором
- Добавь 2-3 эмодзи
- История должна быть доброй, теплой, семейной
- В конце пожелай счастья и успехов в Новом Году

Пример: если желание "хочу больше путешествовать", а человек любит поесть - обыграй, как он будет путешествовать за вкусной едой.

Стиль: веселая байка про родственника на семейном празднике.`;

    const userPrompt = `Создай смешную новогоднюю историю про:

${member.name}
${member.description}

Желание: "${wish}"

Придумай забавную историю-шутку (400-500 символов):
1. Покажи смешную ситуацию, КАК этот человек будет добиваться своего желания
2. Используй его реальные привычки и особенности для создания юмора
3. Обыграй желание через призму личности человека (его любимые занятия, слабости, привычки)
4. Сделай историю живой и личной, не формальной
5. Закончи теплым пожеланием счастья в Новом Году

Пример подхода: если желание про учебу, а человек любит играть - покажи смешную ситуацию с этим.

Важно: история должна быть узнаваемой именно для этого человека!`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
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
                max_tokens: 800,
                temperature: 0.8
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Azure OpenAI error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        
        if (!content) {
            throw new Error('Empty response from AI');
        }
        
        return content.trim();

    } catch (error) {
        context.log('AI error:', error.message);
        throw error;
    }
}

// Mock greeting generator
function generateMockGreeting(wish, member) {
    const cleanWish = wish.replace(/^в следующем году я хочу\s*/i, '');
    const greetings = [
        `Представь: ${member.name} ${cleanWish}! Зная нашу ${member.name}, это будет весело! 🎄 С Новым Годом и пусть всё получится! ✨`,
        `${member.name} решил(а) ${cleanWish}! Ну ${member.name}, держись! 🎅 Пусть Новый Год принесет много радости и успехов! 🎁`,
        `Слышали новость? ${member.name} ${cleanWish}! Это будет приключение! 🎊 С Новым Годом, пусть всё сбудется! 🎉`
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
}
