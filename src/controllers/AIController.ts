import OpenAI from "openai";
import type {Context} from "hono";
import type {UserInterface} from "../types/user.ts";
import {UserService} from "../services/UserService.ts";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE_URL || null,
})

export class AIController {
    private userService = new UserService();

    async generateCompletion(c: Context){
        const { name, prompt, temperature, top_p } = c.req.valid('json');
        const user = <UserInterface>c.get('user');

        if(user.properties.usage_alloc.ai_faker.max <= user.properties.usage_alloc.ai_faker.current){
            return c.json({
                status: false,
                code: 'limit_reached',
                error: 'You have reached your daily limit of AI requests. Please try again tomorrow.'
            })
        }

        const completion = await openai.responses.create({
            model: 'gpt-4o-mini',
            temperature: temperature || 1,
            top_p: top_p || 1,
            max_output_tokens: 30,
            stream: false,
            text: {
                format: {
                    type: 'text'
                }
            },
            input: [
                {
                    role: 'system',
                    content: [
                        {
                            type: 'input_text',
                            "text": "Generate realistic but fake data similar to Faker.js, according to the given prompt.\nRespond accurately with fake data only, without errors or additional commentary.\n# Examples\n- **Prompt**: Nama orang indonesia\n  - **Response**: Anton Wibowo\n- **Prompt**: [user prompt]\n  - **Response**: [realistic fake data]"
                        }
                    ]
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'input_text',
                            text: prompt
                        }
                    ]
                }
            ]
        });

        if(completion.status !== 'completed' && completion.status !== 'incomplete'){
            return c.json({
                status: false,
                code: 'fatal_error',
                error: 'OpenAI API error: ' + completion.error?.message
            })
        }

        await this.userService.incrementAllocUsage(user.properties, 'ai_faker')

        return c.json({
            status: true,
            code: 'ok',
            data: {
                answer: completion.output[0].content[0].text
            },
            as: name
        })
    }
}