import { Auth, signInAnonymously } from '@angular/fire/auth';
import { MessageState, MessageStore } from './message.store';
import { inject } from '@angular/core';

export function initializeAppFactory(): () => Promise<unknown> {
    const messageStore = inject(MessageStore);
    const auth = inject(Auth);

    return () =>
        signInAnonymously(auth).then(({ user }) => {
            messageStore.setUserId(user.uid);

            return user;
        });
}
