import { render, screen, waitFor } from '@testing-library/angular'
import '@testing-library/jest-dom'
import { GameManagerComponent } from './game-manager.component'
import userEvent from '@testing-library/user-event'

describe('Game Manager', () => {
    it('should render the game settings first', async () => {
        await render(GameManagerComponent)
        expect(screen.getByText("Select difficulty")).toBeInTheDocument()
        expect(screen.queryByText("Game starts!")).not.toBeInTheDocument()
    })

    it('should change to game screen when a game starts', async () => {       
        const user = userEvent.setup()
        await render(GameManagerComponent) 
        
        await user.click(screen.getAllByRole('button', { name: 'Start Game' })[1])

        expect(screen.getByText(/Game starts!/)).toBeInTheDocument()
    })
})