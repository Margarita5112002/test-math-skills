import { Component, ComponentRef, ViewContainerRef } from '@angular/core';
import { GameSetupComponent } from '../game-setup/game-setup.component';
import { GameSetupSettings } from '../interfaces/game-setup-settings';
import { GameComponent } from '../game/game.component';

@Component({
  selector: 'app-game-manager',
  imports: [],
  templateUrl: './game-manager.component.html',
  styleUrl: './game-manager.component.css'
})
export class GameManagerComponent {
    private gameSetupRef: ComponentRef<GameSetupComponent> | null = null
    private gameRef: ComponentRef<GameComponent> | null = null

    constructor(private vcr: ViewContainerRef){}

    ngOnInit() {
        this.loadGameSetup()
    }

    loadGameSetup() {
        this.gameSetupRef = this.vcr.createComponent(GameSetupComponent)
        this.gameSetupRef.instance.onStartGame.subscribe(this.whenGameStarts.bind(this))
    }

    loadGameComponent(sets: GameSetupSettings) {
        this.gameRef = this.vcr.createComponent(GameComponent)
        this.gameRef.setInput("gameSettings", sets)
    }

    whenGameStarts(sets: GameSetupSettings){
        if(this.gameSetupRef != null) {
            this.gameSetupRef.destroy()
        }
        this.loadGameComponent(sets)
    }

}
