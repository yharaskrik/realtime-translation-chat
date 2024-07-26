import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MessageStore } from '../message.store';
import { RouterLink } from '@angular/router';
import { AiService } from '../ai.service';

@Component({
    selector: 'app-login',
    template: `
        <div class="h-100 w-100 d-flex flex-column align-items-center">
            @if (aiService.available() === null) {
                Checking to see if your browser supports the Built-In AI.
            } @else if (aiService.available()) {
                Your name is {{ messageStore.name() || '____' }} and you speak
                {{ messageStore.language() || '____' }} and you have an ID of {{ messageStore.userId() }}
                <div class="spacer">
                    <label for="name-ctrl">What is your name?</label>
                    <input id="name-ctrl" (keyup)="nameChange($event)" />
                </div>
                <div class="spacer">
                    <label for="lang">What language do you speak?</label>
                    <input id="lang" (keyup)="languageChange($event)" />
                </div>
                <div class="spacer">
                    <button routerLink="chat" [disabled]="!messageStore.infoValid()">Let's Chat!</button>
                </div>
            } @else {
                Sorry, your browser does not support the Built-In AI. Find the instructions
                <a
                    target="_blank"
                    href="https://medium.com/google-cloud/google-chrome-has-a-secret-ai-assistant-9accb95f1911"
                >
                    here
                </a>
                .
            }
        </div>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `
        .spacer {
            margin-top: 2rem;
        }
    `,
    imports: [RouterLink],
})
export class LoginComponent {
    protected readonly messageStore = inject(MessageStore);

    protected readonly aiService = inject(AiService);

    nameChange(event: Event) {
        this.messageStore.setName((event.target as HTMLInputElement).value);
    }

    languageChange(event: Event) {
        this.messageStore.setLanguage((event.target as HTMLSelectElement).value);
    }
}
