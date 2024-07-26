import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageStore } from './message.store';

@Component({
    standalone: true,
    imports: [RouterModule],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    title = 'realtime-translation-chat';
    constructor() {
        this.createSession();
    }

    async createSession() {
        const session = await (window as any).ai.createTextSession();

        console.log(
            await session.prompt('Translate the following sentence to Japanese: Hello, how are you today?')
        );
    }
}
