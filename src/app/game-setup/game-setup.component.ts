import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, output, signal, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameSetupSettings } from '../interfaces/game-setup-settings';
import { stringToMathProblemDifficulty } from '../interfaces/math-problem.utils';

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
        const modeChose = this.mode() == 'zen' ? 'zen' : 'blitz'
        if(modeChose === 'zen') {
            this.onStartGame.emit({
                difficulty: stringToMathProblemDifficulty(this.difficulty()),
                mode: modeChose,
                problemsToFinish: Number(this.zenNumberOfProblems())
            })
        } else {
            this.onStartGame.emit({
                difficulty: stringToMathProblemDifficulty(this.difficulty()),
                mode: modeChose,
                timeLimitMinutes: Number(this.blitzTime())
            })
        }
    }

}
