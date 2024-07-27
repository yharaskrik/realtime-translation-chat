import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Message } from './message';
import { computed, inject } from '@angular/core';
import { Database, ListenEvent, push, ref, set, stateChanges } from '@angular/fire/database';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, pipe, switchMap, tap } from 'rxjs';
import { AiService } from './ai.service';

export interface MessageState {
    messages: Message[];
    userId: string | null;
    name: string | null;
    language: string | null;
}

const initialState: MessageState = {
    messages: [],
    userId: null,
    name: null,
    language: null,
};

export const MessageStore = signalStore(
    withState(initialState),
    withComputed(({ name, language }) => ({
        infoValid: computed(() => name() && language()),
    })),
    withMethods((store) => ({
        setUserId(userId: string): void {
            patchState(store, () => ({
                userId,
            }));
        },
        setName(name: string): void {
            patchState(store, () => ({
                name,
            }));
        },
        setLanguage(language: string): void {
            patchState(store, () => ({
                language,
            }));
        },
    })),
    withMethods((store, database = inject(Database), aiService = inject(AiService)) => ({
        sendMessage: (content: string) => {
            const chatsRef = ref(database, 'chats');
            const chatRef = push(chatsRef);

            const userId = store.userId();
            const name = store.name();
            if (userId && name)
                set(chatRef, {
                    userId,
                    name,
                    content,
                    id: window.crypto.randomUUID(),
                } satisfies Message);
        },
        listenForMessages: rxMethod<void>(
            pipe(
                switchMap(() =>
                    stateChanges(ref(database, 'chats'), {
                        events: [ListenEvent.added],
                    }).pipe(
                        concatMap(async (event) => {
                            const message = event.snapshot.toJSON() as Message;

                            if (!message.content?.trim()) {
                                return null;
                            }

                            if (message.userId === store.userId()) {
                                return message;
                            }

                            const translatedMessage = await aiService.translate(message.content, store.language());

                            return {
                                ...message,
                                content: translatedMessage,
                            };
                        }),
                        tap((message: Message | null) => {
                            if (message)
                                patchState(store, () => ({
                                    messages: [...store.messages(), message].slice(store.messages().length - 50),
                                }));
                        })
                    )
                )
            )
        ),
    }))
);
