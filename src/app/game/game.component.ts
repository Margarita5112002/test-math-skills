import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameSetupSettings } from '../interfaces/game-setup-settings';

@Component({
  selector: 'app-game',
  imports: [FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
    gameSettings = input<GameSetupSettings>({
        difficulty: 'mid',
        mode: 'zen',
        timeLimitMinutes: 3,
        numProblems: 10
    })

}
