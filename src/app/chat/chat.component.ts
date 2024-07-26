import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MessageStore } from '../message.store';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-chat',
    template: `
        <div style="height: 100vh">
            <div class="message-history">
                @for (message of messageStore.messages(); track message) {
                    <div class="message" [class.my-message]="message.userId === messageStore.userId()">
                        {{ message.content }}
                    </div>
                }
            </div>
            <div class="message-box">
                <form>
                    <input name="message" placeholder="What do you want to say?" [(ngModel)]="message" />
                    <button type="submit" (click)="addMessage()">Send</button>
                </form>
            </div>
        </div>
    `,
    standalone: true,
    imports: [JsonPipe, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `
        .message-history {
            height: 95vh;
            overflow: scroll;

            .message {
                width: 100%;
                margin: 1.75rem;
                text-wrap: wrap;
            }

            .my-message {
                text-align: right;
            }
        }

        .message-box {
            height: 5vh;
            position: fixed;
            bottom: 0;
            width: 100%;

            input {
                width: 90%;
            }
        }
    `,
})
export class ChatComponent {
    protected readonly messageStore = inject(MessageStore);

    message = '';

    constructor() {
        this.messageStore.listenForMessages();
    }

    addMessage() {
        this.messageStore.sendMessage(this.message);
        this.message = '';
    }
}
