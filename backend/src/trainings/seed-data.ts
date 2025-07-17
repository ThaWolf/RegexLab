import { TrainingExercise } from './training-exercise.entity'
import { TrainingLevel } from './training-level.enum'

export const trainingExercises: Partial<TrainingExercise>[] = [
  // Basic Level Exercises
  {
    level: TrainingLevel.BASIC,
    inputString: 'cat, dog, bird, fish',
    expectedRegex: 'cat',
    description: 'Find the word "cat" in the given text.'
  },
  {
    level: TrainingLevel.BASIC,
    inputString: 'apple, banana, orange, grape',
    expectedRegex: 'banana',
    description: 'Find the word "banana" in the given text.'
  },
  {
    level: TrainingLevel.BASIC,
    inputString: 'hello world, hello there, goodbye',
    expectedRegex: 'hello',
    description: 'Find all occurrences of "hello" in the text.'
  },
  {
    level: TrainingLevel.BASIC,
    inputString: 'red car, blue car, green car',
    expectedRegex: 'car',
    description: 'Find all occurrences of "car" in the text.'
  },
  {
    level: TrainingLevel.BASIC,
    inputString: '123, 456, 789, 012',
    expectedRegex: '123',
    description: 'Find the number "123" in the given text.'
  },

  // Intermediate Level Exercises
  {
    level: TrainingLevel.INTERMEDIATE,
    inputString: 'user@example.com, admin@test.org, guest@demo.net',
    expectedRegex: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    description: 'Find all email addresses in the text.'
  },
  {
    level: TrainingLevel.INTERMEDIATE,
    inputString: 'Phone: +1-555-123-4567, Mobile: 555-987-6543',
    expectedRegex: '\\+?[1-9]\\d{0,14}',
    description: 'Find all phone numbers in the text.'
  },
  {
    level: TrainingLevel.INTERMEDIATE,
    inputString: 'Date: 2024-01-15, Event: 2024-12-25',
    expectedRegex: '\\d{4}-\\d{2}-\\d{2}',
    description: 'Find all dates in YYYY-MM-DD format.'
  },
  {
    level: TrainingLevel.INTERMEDIATE,
    inputString: 'https://example.com, http://test.org, ftp://demo.net',
    expectedRegex: 'https?:\\/\\/[\\w\\-\\.]+\\.[a-zA-Z]{2,}',
    description: 'Find all HTTP and HTTPS URLs.'
  },
  {
    level: TrainingLevel.INTERMEDIATE,
    inputString: 'Word1, word2, Word3, WORD4',
    expectedRegex: '[A-Z][a-z]+',
    description: 'Find all words that start with a capital letter followed by lowercase letters.'
  },

  // Advanced Level Exercises
  {
    level: TrainingLevel.ADVANCED,
    inputString: 'password123, securePass456, weakPass',
    expectedRegex: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}',
    description: 'Find passwords that contain at least one lowercase letter, one uppercase letter, one digit, and are at least 8 characters long.'
  },
  {
    level: TrainingLevel.ADVANCED,
    inputString: 'IPv4: 192.168.1.1, 10.0.0.1, 172.16.0.1',
    expectedRegex: '\\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    description: 'Find all valid IPv4 addresses.'
  },
  {
    level: TrainingLevel.ADVANCED,
    inputString: 'Credit: 4111111111111111, 5555555555554444, 378282246310005',
    expectedRegex: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\\d{3})\\d{11})$',
    description: 'Find all valid credit card numbers (Visa, MasterCard, American Express, Discover).'
  },
  {
    level: TrainingLevel.ADVANCED,
    inputString: 'HTML: <div>content</div>, <span>text</span>, <p>paragraph</p>',
    expectedRegex: '<([a-z]+)(?:[^<]+)*(?:>(?:<\\/[a-z]+>)*<\\/\\1>|\\/>)',
    description: 'Find all properly closed HTML tags.'
  },
  {
    level: TrainingLevel.ADVANCED,
    inputString: 'Time: 09:30, 14:45, 23:15, 00:00',
    expectedRegex: '([01]?[0-9]|2[0-3]):[0-5][0-9]',
    description: 'Find all valid 24-hour time formats (HH:MM).'
  }
] 