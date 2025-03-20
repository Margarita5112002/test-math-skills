import { render, screen } from '@testing-library/angular'
import { GameSetupComponent } from './game-setup.component'
import '@testing-library/jest-dom'

describe('Game Setup', () => {
    it('should render setup screen', async () => {
        await render(GameSetupComponent)

        expect(screen.getByText('Select difficulty')).toBeVisible()
    })
})