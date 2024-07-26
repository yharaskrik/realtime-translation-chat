import { Route, Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { inject } from '@angular/core';
import { MessageStore } from './message.store';

export const appRoutes: Route[] = [
    {
        path: '',
        component: LoginComponent,
    },
    {
        path: 'chat',
        component: ChatComponent,
        canActivate: [
            () => {
                const messageStore = inject(MessageStore);
                const router = inject(Router);

                return messageStore.name() ? true : router.createUrlTree([]);
            },
        ],
    },
];
