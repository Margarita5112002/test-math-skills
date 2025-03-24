import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { GameManagerComponent } from './game-manager/game-manager.component';

export const routes: Routes = [
    {
        path: "home", component: GameManagerComponent
    },
    {
        path: "", redirectTo: "/home", pathMatch: 'full',
    }, 
    {
        path: "**", component: PageNotFoundComponent
    }
];
