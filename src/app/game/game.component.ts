import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameSetupSettings } from '../interfaces/game-setup-settings';
import { MathProblemDifficulty } from '../interfaces/math-problem';

@Component({
  selector: 'app-game',
  imports: [FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
    gameSettings = input<GameSetupSettings>({
        difficulty: MathProblemDifficulty.MID,
        mode: 'zen',
        timeLimitMinutes: 3,
        numProblems: 10
    })

}
