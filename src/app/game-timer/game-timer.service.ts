import { Injectable } from "@angular/core";
import { interval, map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GameTimerService {

    getTimeObservable() {
        return interval(1000).pipe(
            map(x => x + 1)
        )
    }

}