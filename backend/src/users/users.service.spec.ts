import { UsersService } from './users.service'
import { TrainingExercise } from '../trainings/training-exercise.entity'
import { TrainingResult } from '../trainings/training-result.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Test } from '@nestjs/testing'

describe('UsersService', () => {
  let service: UsersService
  let resultsRepo: any

  beforeEach(async () => {
    const builder = {
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([{ level: 'basic', count: '2' }]),
    }
    resultsRepo = {
      count: jest.fn().mockResolvedValueOnce(3).mockResolvedValueOnce(2),
      createQueryBuilder: jest.fn(() => builder),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(TrainingResult), useValue: resultsRepo },
        { provide: getRepositoryToken(TrainingExercise), useValue: {} },
      ],
    }).compile()

    service = moduleRef.get(UsersService)
  })

  it('computes user stats', async () => {
    const stats = await service.getStats(1)
    expect(stats).toEqual({
      totalCompleted: 3,
      correctByLevel: { basic: 2 },
      successRate: 2 / 3,
    })
  })
})
