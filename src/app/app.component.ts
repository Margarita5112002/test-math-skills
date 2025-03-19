import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameManagerComponent } from "./game-manager/game-manager.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GameManagerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'test-math-skills';
}
