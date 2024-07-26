import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { initializeAppFactory } from './app-initializer';
import { Auth, getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { MessageStore } from './message.store';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(appRoutes),
        provideFirebaseApp(() =>
            initializeApp({
                apiKey: 'AIzaSyAPnPG5Zrr-BF_regs7_yqa-qQ2-Y5nLro',
                authDomain: 'realtime-translation-chat.firebaseapp.com',
                projectId: 'realtime-translation-chat',
                storageBucket: 'realtime-translation-chat.appspot.com',
                messagingSenderId: '757077853674',
                appId: '1:757077853674:web:6c82310ceddf9af4f75e93',
            })
        ),
        provideAuth(() => getAuth()),
        provideDatabase(() => getDatabase()),
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: initializeAppFactory,
        },
        MessageStore,
    ],
};
