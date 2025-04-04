import { TestBed } from "@angular/core/testing"
import { GameStats } from "../interfaces/game-stats"
import { MathProblemDifficulty } from "../interfaces/math-problem"
import { GameStatsService, GameStatsServiceError } from "./game-stats.service"
import { GameResult } from "../interfaces/game-result"

describe('Game Stats Service', () => {
    let gameStatsService: GameStatsService
    const mockGetItem = jest.fn()
    const mockSetItem = jest.fn()
    const mockRemoveItem = jest.fn()
    Object.defineProperty(window, 'localStorage', {
        value: {
            getItem: (...arg: string[]) => mockGetItem(...arg),
            setItem: (...arg: string[]) => mockSetItem(...arg),
            removeItem: (...arg: string[]) => mockRemoveItem(...arg),
        }
    })

    beforeEach(() => {
        gameStatsService = TestBed.inject(GameStatsService)
        mockGetItem.mockClear()
        mockSetItem.mockClear()
        mockSetItem.mockReset()
        mockRemoveItem.mockClear()
    })

    it('should store game stats in local storage if local storage is empty', async () => {
        const dataStorage: GameStats[] = []
        const gameResult: GameResult = {
            settings: {
                mode: 'zen',
                difficulty: MathProblemDifficulty.HARD,
                problemsToFinish: 10
            },
            timeTakenMinutes: 2,
            tries: 25,
            problemsCounter: {
                ADD: { correct: 4, fail: 1 },
                SUB: { correct: 1, fail: 0 },
                DIV: { correct: 3, fail: 4 },
                MULT: { correct: 2, fail: 0 },
            }
        }
        const expectedGameStats: GameStats = {
            gameSettings: gameResult.settings,
            timePlayedMinutes: 2,
            gamesPlayed: 1,
            averageTimePerProblemSeconds: 12,
            record: 12,
            problems: gameResult.problemsCounter
        }

        mockGetItem.mockReturnValue(JSON.stringify(dataStorage))

        gameStatsService.setGameResult(gameResult)
        const error = gameStatsService.storeGameResult()

        expect(error).toBe("")
        expect(mockSetItem.mock.calls).toHaveLength(1)
        const result = JSON.parse(mockSetItem.mock.calls[0][1])
        expect(result).toStrictEqual([expectedGameStats])
    })

    it('should store game stats in local storage if local storage has other game stats', async () => {
        const dataStorage: GameStats[] = [
            {
                gameSettings: {
                    mode: 'blitz',
                    difficulty: MathProblemDifficulty.HARD,
                    timeLimitMinutes: 5
                },
                timePlayedMinutes: 10,
                gamesPlayed: 2,
                averageTimePerProblemSeconds: 20.5,
                record: 15,
                problems: {
                    MULT: { correct: 10, fail: 5 },
                    DIV: { correct: 10, fail: 1 },
                    ADD: { correct: 15, fail: 0 },
                    SUB: { correct: 17, fail: 7 },
                }
            }
        ]
        const gameResult: GameResult = {
            settings: {
                mode: 'zen',
                difficulty: MathProblemDifficulty.HARD,
                problemsToFinish: 10
            },
            timeTakenMinutes: 1,
            tries: 40,
            problemsCounter: {
                ADD: { correct: 3, fail: 2 },
                SUB: { correct: 4, fail: 1 },
                DIV: { correct: 1, fail: 0 },
                MULT: { correct: 2, fail: 1 },
            }
        }
        const expectedGameStats: GameStats[] = [
            ...dataStorage, {
                gameSettings: gameResult.settings,
                timePlayedMinutes: 1,
                gamesPlayed: 1,
                averageTimePerProblemSeconds: 6,
                record: 6,
                problems: gameResult.problemsCounter
            }]

        mockGetItem.mockReturnValue(JSON.stringify(dataStorage))

        gameStatsService.setGameResult(gameResult)
        const error = gameStatsService.storeGameResult()

        expect(error).toBe("")
        expect(mockSetItem.mock.calls).toHaveLength(1)
        const result = JSON.parse(mockSetItem.mock.calls[0][1])
        expect(result).toStrictEqual(expectedGameStats)
    })

    it('should store game stats in local storage if local storage has other game stats with the same settings', async () => {
        const dataStorage: GameStats[] = [{
            gameSettings: {
                mode: 'blitz',
                difficulty: MathProblemDifficulty.MID,
                timeLimitMinutes: 3
            },
            timePlayedMinutes: 12,
            gamesPlayed: 4,
            averageTimePerProblemSeconds: 30,
            record: 20.5,
            problems: {
                MULT: { correct: 7, fail: 1 },
                DIV: { correct: 7, fail: 10 },
                ADD: { correct: 4, fail: 4 },
                SUB: { correct: 6, fail: 2 },
            }
        }]
        const gameResult: GameResult = {
            settings: {
                mode: 'blitz',
                difficulty: MathProblemDifficulty.MID,
                timeLimitMinutes: 3
            },
            timeTakenMinutes: 3,
            tries: 19,
            problemsCounter: {
                MULT: { correct: 3, fail: 1 },
                DIV: { correct: 3, fail: 0 },
                ADD: { correct: 5, fail: 2 },
                SUB: { correct: 1, fail: 1 },
            }
        }
        const expectedGameStats: GameStats[] = [{
            gameSettings: {
                mode: 'blitz',
                difficulty: MathProblemDifficulty.MID,
                timeLimitMinutes: 3
            },
            timePlayedMinutes: 15,
            gamesPlayed: 5,
            averageTimePerProblemSeconds: 25,
            record: 15,
            problems: {
                MULT: { correct: 10, fail: 2 },
                DIV: { correct: 10, fail: 10 },
                ADD: { correct: 9, fail: 6 },
                SUB: { correct: 7, fail: 3 },
            }
        }]

        mockGetItem.mockReturnValue(JSON.stringify(dataStorage))

        gameStatsService.setGameResult(gameResult)
        const error = gameStatsService.storeGameResult()

        expect(error).toBe("")
        expect(mockSetItem.mock.calls).toHaveLength(1)
        const result = JSON.parse(mockSetItem.mock.calls[0][1])
        expect(result).toStrictEqual(expectedGameStats)
    })

    it('should store game stats in local storage and return an error if local storage is disabled or full', async () => {
        const dataStorage: GameStats[] = [
            {
                gameSettings: {
                    mode: 'zen',
                    difficulty: MathProblemDifficulty.MID,
                    problemsToFinish: 10
                },
                timePlayedMinutes: 5,
                gamesPlayed: 3,
                averageTimePerProblemSeconds: 6,
                record: 3,
                problems: {
                    MULT: { correct: 10, fail: 5 },
                    DIV: { correct: 8, fail: 3 },
                    ADD: { correct: 13, fail: 1 },
                    SUB: { correct: 9, fail: 3 },
                }
            }
        ]
        const gameResult: GameResult = {
            settings: {
                mode: 'blitz',
                difficulty: MathProblemDifficulty.EASY,
                timeLimitMinutes: 1
            },
            timeTakenMinutes: 1,
            tries: 10,
            problemsCounter: {
                ADD: { correct: 1, fail: 1 },
                SUB: { correct: 1, fail: 0 },
                DIV: { correct: 3, fail: 1 },
                MULT: { correct: 1, fail: 1 },
            }
        }
        const expectedGameStats: GameStats[] = [...dataStorage, {
            gameSettings: gameResult.settings,
            timePlayedMinutes: 1,
            gamesPlayed: 1,
            averageTimePerProblemSeconds: 10,
            record: 10,
            problems: gameResult.problemsCounter
        }]

        mockGetItem.mockReturnValue(JSON.stringify(dataStorage))
        mockSetItem.mockImplementation(() => {
            throw new DOMException('Quota exceeded', 'QuotaExceededError');
        })

        gameStatsService.setGameResult(gameResult)
        const error = gameStatsService.storeGameResult()

        expect(error).toMatch(/local storage is disabled/)
        expect(mockSetItem.mock.calls).toHaveLength(1)
        const result = JSON.parse(mockSetItem.mock.calls[0][1])
        expect(result).toStrictEqual(expectedGameStats)
    })

    it('should store game stats in local storage and return an error if retrieve game stats from local storage fails', async () => {
        const dataStorage = [
            {
                gameSettings: {
                    mode: 'zen',
                    difficulty: MathProblemDifficulty.MID,
                    problemsToFinish: 10
                },
                timePlayedMinutes: 5,
                gamesPlayed: 3,
                averageTimePerProblemSeconds: 6,
                record: 3
            }
        ]
        const gameResult: GameResult = {
            settings: {
                mode: 'zen',
                difficulty: MathProblemDifficulty.HARD,
                problemsToFinish: 30
            },
            timeTakenMinutes: 6,
            tries: 40,
            problemsCounter: {
                ADD: { correct: 10, fail: 1 },
                SUB: { correct: 11, fail: 3 },
                DIV: { correct: 7, fail: 1 },
                MULT: { correct: 12, fail: 1 },
            }
        }
        const expectedGameStats: GameStats[] = [{
            gameSettings: gameResult.settings,
            timePlayedMinutes: 6,
            gamesPlayed: 1,
            averageTimePerProblemSeconds: 9,
            record: 9,
            problems: gameResult.problemsCounter
        }]

        mockGetItem.mockReturnValue(JSON.stringify(dataStorage))

        gameStatsService.setGameResult(gameResult)
        const error = gameStatsService.storeGameResult()

        expect(error).toMatch(/local storage is corrupted/)
        expect(mockSetItem.mock.calls).toHaveLength(1)
        const result = JSON.parse(mockSetItem.mock.calls[0][1])
        expect(result).toStrictEqual(expectedGameStats)
    })

    it('should retrieve game stats from local storage', async () => {
        const dataStorage: GameStats[] = [{
            "gameSettings": {
                "difficulty": MathProblemDifficulty.EASY,
                "mode": "zen",
                "problemsToFinish": 10
            },
            "averageTimePerProblemSeconds": 10.5,
            "gamesPlayed": 5,
            "problems": {
                MULT: { correct: 10, fail: 10 },
                DIV: { correct: 10, fail: 10, total: 20 },
                SUB: { correct: 10, fail: 10, correctPercentage: 50 },
                ADD: { correct: 10, fail: 10, correctPercentage: 50, total: 20 },
            },
            "record": 30,
            "timePlayedMinutes": 300
        }]

        mockGetItem.mockReturnValue(JSON.stringify(dataStorage))
        const res = gameStatsService.retrieveGameStats()
        expect(res).toStrictEqual(dataStorage)
    })

    it('should throw GameStatServiceError if local storage stores a bad json', async () => {
        mockGetItem.mockReturnValue("{bad json]")

        function getGameStats() {
            gameStatsService.retrieveGameStats()
        }

        expect(getGameStats).toThrow(GameStatsServiceError)
        expect(getGameStats).toThrow(/json/)
    })

    it('should throw GameStatServiceError if local storage don\'t store an array', async () => {
        mockGetItem.mockReturnValue("{}")

        function getGameStats() {
            gameStatsService.retrieveGameStats()
        }

        expect(getGameStats).toThrow(GameStatsServiceError)
        expect(getGameStats).toThrow(/array/)
    })

    it('should throw GameStatServiceError if local storage stores bad game settings', async () => {
        const dataStorage = [{
            "gameSettings": {
                "difficulty": "EaSy",
                "mode": "zen",
                "problemsToFinish": 10
            },
            "averageTimePerProblemSeconds": 10.5,
            "gamesPlayed": 5,
            "problems": {
                MULT: { correct: 10, fail: 10 },
                DIV: { correct: 10, fail: 10, total: 20 },
                SUB: { correct: 10, fail: 10, correctPercentage: 50 },
                ADD: { correct: 10, fail: 10, correctPercentage: 50, total: 20 },
            },
            "record": 30,
            "timePlayedMinutes": 300
        }]
        mockGetItem.mockReturnValue(JSON.stringify(dataStorage))

        function getGameStats() {
            gameStatsService.retrieveGameStats()
        }

        expect(getGameStats).toThrow(TypeError)
        expect(getGameStats).toThrow(/MathProblemDifficulty/)
    })

    it('should throw GameStatServiceError if local storage stores a bad average time per problem', async () => {
        const dataStorage = [{
            "gameSettings": {
                "difficulty": MathProblemDifficulty.HARD,
                "mode": "zen",
                "problemsToFinish": 10
            },
            "gamesPlayed": 5,
            "problems": {
                MULT: { correct: 10, fail: 10 },
                DIV: { correct: 10, fail: 10, total: 20 },
                SUB: { correct: 10, fail: 10, correctPercentage: 50 },
                ADD: { correct: 10, fail: 10, correctPercentage: 50, total: 20 },
            },
            "record": 30,
            "timePlayedMinutes": 300
        }]
        mockGetItem.mockReturnValue(JSON.stringify(dataStorage))

        function getGameStats() {
            gameStatsService.retrieveGameStats()
        }

        expect(getGameStats).toThrow(TypeError)
        expect(getGameStats).toThrow(/averageTimePerProblemSeconds/)
    })

    it('should throw GameStatServiceError if local storage stores a bad games played', async () => {
        const dataStorage = [{
            "gameSettings": {
                "difficulty": MathProblemDifficulty.HARD,
                "mode": "zen",
                "problemsToFinish": 10
            },
            "averageTimePerProblemSeconds": 10.5,
            "gamesPlayed": "hi",
            "problems": {
                MULT: { correct: 10, fail: 10 },
                DIV: { correct: 10, fail: 10, total: 20 },
                SUB: { correct: 10, fail: 10, correctPercentage: 50 },
                ADD: { correct: 10, fail: 10, correctPercentage: 50, total: 20 },
            },
            "record": 30,
            "timePlayedMinutes": 300
        }]
        mockGetItem.mockReturnValue(JSON.stringify(dataStorage))

        function getGameStats() {
            gameStatsService.retrieveGameStats()
        }

        expect(getGameStats).toThrow(TypeError)
        expect(getGameStats).toThrow(/gamesPlayed/)
    })

    it('should throw GameStatServiceError if local storage stores a bad problem counters', async () => {
        const dataStorage = [{
            "gameSettings": {
                "difficulty": MathProblemDifficulty.HARD,
                "mode": "zen",
                "problemsToFinish": 10
            },
            "averageTimePerProblemSeconds": 10.5,
            "gamesPlayed": 2,
            "problems": {
                MULT: { correct: 10, fail: 10 },
                DIV: { correct: 10, fail: 10, total: 20 },
                sub: { correct: 10, fail: 10, correctPercentage: 50 },
                ADD: { correct: 10, fail: 10, correctPercentage: 50, total: 20 },
            },
            "record": 30,
            "timePlayedMinutes": 300
        }]
        mockGetItem.mockReturnValue(JSON.stringify(dataStorage))

        function getGameStats() {
            gameStatsService.retrieveGameStats()
        }

        expect(getGameStats).toThrow(TypeError)
        expect(getGameStats).toThrow(/MathProblemCounters/)
    })

    it('should throw GameStatServiceError if local storage stores a bad record', async () => {
        const dataStorage = [{
            "gameSettings": {
                "difficulty": MathProblemDifficulty.HARD,
                "mode": "zen",
                "problemsToFinish": 10
            },
            "averageTimePerProblemSeconds": 10.5,
            "gamesPlayed": 2,
            "problems": {
                MULT: { correct: 10, fail: 10 },
                DIV: { correct: 10, fail: 10, total: 20 },
                SUB: { correct: 10, fail: 10, correctPercentage: 50 },
                ADD: { correct: 10, fail: 10, correctPercentage: 50, total: 20 },
            },
            "record": {},
            "timePlayedMinutes": 300
        }]
        mockGetItem.mockReturnValue(JSON.stringify(dataStorage))

        function getGameStats() {
            gameStatsService.retrieveGameStats()
        }

        expect(getGameStats).toThrow(TypeError)
        expect(getGameStats).toThrow(/record/)
    })

    it('should throw GameStatServiceError if local storage stores a bad time played', async () => {
        const dataStorage = [{
            "gameSettings": {
                "difficulty": MathProblemDifficulty.HARD,
                "mode": "zen",
                "problemsToFinish": 10
            },
            "averageTimePerProblemSeconds": 10.5,
            "gamesPlayed": 2,
            "problems": {
                MULT: { correct: 10, fail: 10 },
                DIV: { correct: 10, fail: 10, total: 20 },
                SUB: { correct: 10, fail: 10, correctPercentage: 50 },
                ADD: { correct: 10, fail: 10, correctPercentage: 50, total: 20 },
            },
            "record": 30,
            "timePlayedMinutes": null
        }]
        mockGetItem.mockReturnValue(JSON.stringify(dataStorage))

        function getGameStats() {
            gameStatsService.retrieveGameStats()
        }

        expect(getGameStats).toThrow(TypeError)
        expect(getGameStats).toThrow(/timePlayedMinutes/)
    })

})