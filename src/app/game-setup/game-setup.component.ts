import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, output, signal, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameSetupSettings } from '../interfaces/game-setup-settings';

@Component({
    selector: 'app-game-setup',
    imports: [FormsModule, NgTemplateOutlet],
    templateUrl: './game-setup.component.html',
    styleUrl: './game-setup.component.css'
})
export class GameSetupComponent {
    difficulty = signal('mid')
    mode = signal('zen')
    blitzTime = signal(3)
    zenNumberOfProblems = signal(10)
    configBlitzTemplate = viewChild('configBlitz', { read: TemplateRef })
    configZenTemplate = viewChild('configZen', { read: TemplateRef })
    configTemplate = computed(() => {
        const r = (this.mode() === 'zen' ? this.configZenTemplate() : this.configBlitzTemplate())
        return r == undefined ? null : r
    })

    onStartGame = output<GameSetupSettings>()

    startGame() {
        console.log(`difficulty ${this.difficulty()}, mode ${this.mode()}, blitzTime ${this.blitzTime()}, nProblem ${this.zenNumberOfProblems()}`)
        this.onStartGame.emit({
            difficulty: this.difficulty(),
            mode: this.mode(),
            numProblems: this.zenNumberOfProblems(),
            timeLimitMinutes: this.blitzTime()
        } as GameSetupSettings)
    }

}
