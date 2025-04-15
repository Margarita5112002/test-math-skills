import { Component, computed, input } from "@angular/core";

@Component({
    selector: 'progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.css',
})
export class ProgressBarComponent {

    progress = input(0)
    sectionStyles = computed<{
        'background-color': string,
        width: string
    }>(() => { return {
        'background-color': this.progress() <= 0 ? 'transparent' : 'rebeccapurple', 
        width: `${this.progress()}%`
    } }
    )

}