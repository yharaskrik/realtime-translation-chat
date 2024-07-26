import { Injectable, signal } from '@angular/core';

interface Session {
    prompt: (s: string) => Promise<string>;
}

declare const ai: {
    createTextSession: () => Promise<Session>;
};

@Injectable({
    providedIn: 'root',
})
export class AiService {
    readonly available = signal<boolean | null>(null);

    constructor() {
        try {
            ai.createTextSession()
                .then(() => this.available.set(true))
                .catch(() => this.available.set(false));
        } catch (e) {
            this.available.set(false);
        }
    }

    async translate(content: string, toLanguage: string | null): Promise<string> {
        const session = await ai.createTextSession();

        return session.prompt(
            `Translate the following content to ${toLanguage}, if the content is already in ${toLanguage} then do not translate it and just return the content: ${content}`
        );
    }
}
