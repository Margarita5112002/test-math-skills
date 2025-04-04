import { userEvent } from '@testing-library/user-event'
import { getByRole, render, screen } from '@testing-library/angular'
import { GameSetupComponent } from './game-setup.component'
import '@testing-library/jest-dom'
import { MathProblemDifficulty } from '../interfaces/math-problem'

describe('Game Setup', () => {
    it('should render setup screen', async () => {
        await render(GameSetupComponent)

        expect(screen.getByText('Select difficulty')).toBeVisible()
    })

    it('should start the game with blitz mode and other settings', async () => {
        const startGameSpy = jest.fn()
        const user = userEvent.setup()

        await render(GameSetupComponent, {
            on: {
                onStartGame: startGameSpy
            }
        })

        await user.selectOptions(screen.getByDisplayValue('Medium'), MathProblemDifficulty.EASY)
        await user.selectOptions(screen.getByDisplayValue(/Zen/), 'blitz')
        await user.selectOptions(screen.getByDisplayValue(/3 minute/), '5')
        
        await user.click(screen.getByRole('button', { name: 'Start Game' }))

        expect(startGameSpy.mock.calls).toHaveLength(1)
        expect(startGameSpy.mock.calls[0][0]).toStrictEqual({
            difficulty: MathProblemDifficulty.EASY,
            mode: 'blitz',
            timeLimitMinutes: 5,
        })

    })

    it('should start the game with zen mode and other settings', async () => {
        const startGameSpy = jest.fn()
        const user = userEvent.setup()

        await render(GameSetupComponent, {
            on: {
                onStartGame: startGameSpy
            }
        })

        await user.selectOptions(screen.getByDisplayValue('Medium'), MathProblemDifficulty.HARD)
        await user.selectOptions(screen.getByDisplayValue(/10 problems/), '50')
        
        await user.click(screen.getByRole('button', { name: 'Start Game' }))

        expect(startGameSpy.mock.calls).toHaveLength(1)
        expect(startGameSpy.mock.calls[0][0]).toStrictEqual({
            difficulty: MathProblemDifficulty.HARD,
            mode: 'zen',
            problemsToFinish: 50
        })

    })

})