import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class RandomNumberGeneratorService {
    getRandomInRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
        
}