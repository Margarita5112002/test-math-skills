import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game',
  imports: [FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
    difficulty = 'mid'
    mode = 'zen'

    startGame() {
        console.log(`difficulty ${this.difficulty}, mode ${this.mode}`)
    }

}
