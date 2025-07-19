import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TrainingsService } from './trainings.service'
import { TrainingExercise } from './training-exercise.entity'
import { TrainingResult } from './training-result.entity'
import { SeedService } from './seed.service'

describe('TrainingsService', () => {
  let service: TrainingsService
  let exerciseRepo: Repository<TrainingExercise>
  let resultRepo: Repository<TrainingResult>

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TrainingsService,
        {
          provide: getRepositoryToken(TrainingExercise),
          useValue: { findOneBy: jest.fn() },
        },
        {
          provide: getRepositoryToken(TrainingResult),
          useValue: { save: jest.fn() },
        },
        {
          provide: SeedService,
          useValue: { seedTrainingExercises: jest.fn() },
        },
      ],
    }).compile()

    service = moduleRef.get(TrainingsService)
    exerciseRepo = moduleRef.get(getRepositoryToken(TrainingExercise))
    resultRepo = moduleRef.get(getRepositoryToken(TrainingResult))
  })

  it('returns false if exercise not found', async () => {
    jest.spyOn(exerciseRepo, 'findOneBy').mockResolvedValue(null)
    const res = await service.validateRegex(1, 1, 'abc')
    expect(res.valid).toBe(false)
    expect(res.explanation).toBe('Exercise not found')
    expect(resultRepo.save).not.toHaveBeenCalled()
  })

  it('validates regex and saves result', async () => {
    jest.spyOn(exerciseRepo, 'findOneBy').mockResolvedValue({
      id: 1,
      expectedRegex: 'abc',
      inputString: 'abc def',
    } as any)
    jest.spyOn(resultRepo, 'save').mockResolvedValue({} as any)

    const res = await service.validateRegex(1, 1, 'abc')
    expect(res.valid).toBe(true)
    expect(res.explanation).toContain('Great job')
    expect(resultRepo.save).toHaveBeenCalledWith({
      userId: 1,
      exerciseId: 1,
      userRegex: 'abc',
      isCorrect: true,
    })
  })
})
