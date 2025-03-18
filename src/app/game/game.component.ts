import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, signal, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game',
  imports: [FormsModule, NgTemplateOutlet ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
    difficulty = signal('mid')
    mode = signal('zen')
    blitzTime = signal('3m')
    zenNumberOfProblems = signal(10)
    configBlitzTemplate = viewChild('configBlitz', { read: TemplateRef })
    configZenTemplate = viewChild('configZen', { read: TemplateRef })
    configTemplate = computed(() => {
        const r = (this.mode() === 'zen' ? this.configZenTemplate() : this.configBlitzTemplate())
        return r == undefined ? null : r
    })

    startGame() {
        console.log(`difficulty ${this.difficulty()}, mode ${this.mode()}, blitzTime ${this.blitzTime()}, nProblem ${this.zenNumberOfProblems()}`)
    }

}
