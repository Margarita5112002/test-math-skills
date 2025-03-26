import { TestBed } from "@angular/core/testing"
import { MathProblemService } from "./math-problem.service"
import { RandomNumberGeneratorService } from "../utils/random-number-generator.service"
import { MathProblemDifficulty, MathProblemType } from "../interfaces/math-problem"

describe('Math Problem Service', () => {
    let mathProblemService: MathProblemService
    let numberGeneratorMock!: { getRandomInRange: jest.Mock }

    beforeEach(() => {
        numberGeneratorMock = {
            getRandomInRange: jest.fn()
        }
        TestBed.configureTestingModule({
            providers: [
              {
                provide: RandomNumberGeneratorService,
                useValue: numberGeneratorMock,
              },
            ],
          });
      
        mathProblemService = TestBed.inject(MathProblemService);
    })

    it('should return an addition problem', async () => {
        numberGeneratorMock.getRandomInRange
            .mockReturnValueOnce(10)
            .mockReturnValueOnce(5)
            .mockReturnValue(1)
        
        expect(mathProblemService.getMathProblem(MathProblemType.ADD, MathProblemDifficulty.EASY))
            .toStrictEqual({
                type: MathProblemType.ADD,
                operand1: 10,
                operand2: 5,
                solution: 15,
                difficulty: MathProblemDifficulty.EASY
            })
    })

    it('should return a substraction problem', async () => {
        numberGeneratorMock.getRandomInRange
            .mockReturnValueOnce(50)
            .mockReturnValueOnce(20)
        
        expect(mathProblemService.getMathProblem(MathProblemType.SUB, MathProblemDifficulty.MID))
            .toStrictEqual({
                type: MathProblemType.SUB,
                operand1: 50,
                operand2: 20,
                solution: 30,
                difficulty: MathProblemDifficulty.MID
            })
    })

    it('should return a multiplication problem', async () => {
        numberGeneratorMock.getRandomInRange
            .mockReturnValueOnce(7)
            .mockReturnValueOnce(14)
        
        expect(mathProblemService.getMathProblem(MathProblemType.MULT, MathProblemDifficulty.EASY))
            .toStrictEqual({
                type: MathProblemType.MULT,
                operand1: 7,
                operand2: 14,
                solution: 7 * 14,
                difficulty: MathProblemDifficulty.EASY
            })
    })

    it('should return a division problem', async () => {
        numberGeneratorMock.getRandomInRange
            .mockReturnValueOnce(40)
            .mockReturnValueOnce(4)
        
        expect(mathProblemService.getMathProblem(MathProblemType.DIV, MathProblemDifficulty.EASY))
            .toStrictEqual({
                type: MathProblemType.DIV,
                operand1: 40,
                operand2: 4,
                solution: 10,
                difficulty: MathProblemDifficulty.EASY
            })
    })

    it('should return a division problem and make sure the solution is even', async () => {
        numberGeneratorMock.getRandomInRange
            .mockReturnValueOnce(30)
            .mockReturnValueOnce(12)
        
        expect(mathProblemService.getMathProblem(MathProblemType.DIV, MathProblemDifficulty.EASY))
            .toStrictEqual({
                type: MathProblemType.DIV,
                operand1: 36,
                operand2: 12,
                solution: 3,
                difficulty: MathProblemDifficulty.EASY
            })
    })

    it('should return a random math problem', async () => {
        const mathPromTypeChose = Object.values(MathProblemType)[2]

        numberGeneratorMock.getRandomInRange
            .mockReturnValueOnce(2)
            .mockReturnValue(1)
        
        expect(mathProblemService.getRandomMathProblem(MathProblemDifficulty.EASY))
            .toStrictEqual({
                type: mathPromTypeChose,
                operand1: 1,
                operand2: 1,
                solution: 1,
                difficulty: MathProblemDifficulty.EASY
            })
    })

})