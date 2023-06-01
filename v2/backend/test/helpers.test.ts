import { calculateStatus } from '../src/helpers';
// -----------------------------------------------------------
// --------------------------DATA-----------------------------

// -----------------------------------------------------------
// --------------------------HELPERS--------------------------

function minutesAfterNow(num: number): string {
  return new Date(
    new Date().setMinutes(new Date().getMinutes() + num)
  ).toISOString();
}

const ONE_DAY_MINUTES = 1440;

// -----------------------------------------------------------
// calculateStatus

/**
 * export type Class = {
  courseCode: string;
  start: string;
  end: string;
};
 */

describe('Variable Classes', () => {
  console.log(new Date());

  test.each([
    // No Classes Whatsoever
    {
      datetime: new Date(),
      classes: [],
      minDuration: 0,
      expected: {
        status: 'free',
        endtime: '',
      },
    },
    {
      datetime: new Date(),
      classes: [
        {
          courseCode: '2521',
          start: new Date().toString(),
          end: minutesAfterNow(60),
        },
        {
          courseCode: '2521',
          start: new Date().toString(),
          end: minutesAfterNow(120),
        },
        {
          courseCode: '2521',
          start: new Date().toString(),
          end: minutesAfterNow(180),
        },
      ],
      minDuration: 0,
      expected: {
        status: 'free',
        endtime: '',
      },
    },
  ])('calculateStatus($datetime, $classes, $minDuration) === $expected', ({
    datetime,
    classes,
    minDuration,
    expected,
  }) => {
    expect(calculateStatus(datetime, classes, minDuration)).toStrictEqual(expected);
  });
});

// TODO Test with Real Classes
// 1. Find first two classes after
describe('Multi-class calculateStatus', () => {
  test.each([
    // Three classes; All start at the same time, but with different end times.
    {
      datetime: new Date(),
      classes: [
        {
          courseCode: '2521',
          start: minutesAfterNow(0),
          end: minutesAfterNow(60),
        },
        {
          courseCode: '2521',
          start: minutesAfterNow(0),
          end: minutesAfterNow(120),
        },
        {
          courseCode: '2521',
          start: minutesAfterNow(0),
          end: minutesAfterNow(180),
        },
      ],
      minDuration: 0,
      expected: {
        status: 'free',
        endtime: '',
      },
    },
    // Multi-Classes, ending days after
    {

      datetime: new Date(),
      classes: [
        {
          courseCode: '2521',
          start: minutesAfterNow(0),
          end: minutesAfterNow(120),
        },
        {
          courseCode: '2521',
          start: minutesAfterNow(0),
          end: minutesAfterNow(480),
        },
        {
          courseCode: '2521',
          start: minutesAfterNow(0),
          end: minutesAfterNow(ONE_DAY_MINUTES),
        },
      ],
      minDuration: 0,
      expected: {
        status: 'free',
        endtime: '',
      },
    },
  ])('calculateStatus($datetime, $classes, $minDuration) === $expected', ({
    datetime,
    classes,
    minDuration,
    expected,
  }) => {
    expect(calculateStatus(datetime, classes, minDuration)).toStrictEqual(expected);
  });
});

// TODO: More tests
// 2. Datetime < start
describe('Datetime before the start.', () => {
  test.each([
    // Two classes; An hour of free time between now, end of first and beginning of second.
    {
      datetime: new Date(),
      classes: [
        {
          courseCode: '1531',
          start: minutesAfterNow(0),
          end: minutesAfterNow(60),
        },
        {
          courseCode: '1531',
          start: minutesAfterNow(120),
          end: minutesAfterNow(240),
        },
      ],
      minDuration: 60,
      expected: {
        status: 'busy',
        // TODO: What is the endtime?
        endtime: '',
      },
    },
    // 3 Classes Afterwards, all beginning after datetime.
    // Should not be free!
    {
      datetime: new Date(),
      classes: [
        {
          courseCode: '1531',
          start: minutesAfterNow(60),
          end: minutesAfterNow(120),
        },
        {
          courseCode: '1531',
          start: minutesAfterNow(120),
          end: minutesAfterNow(240),
        },
        {
          courseCode: '1531',
          start: minutesAfterNow(240),
          end: minutesAfterNow(480),
        },
      ],
      minDuration: 60,
      expected: {
        status: 'busy',
        // TODO: Fix endtime...
        endtime: '',
      },
    },
  ])('calculateStatus($datetime, $classes, $minDuration) === $expected', ({
    datetime,
    classes,
    minDuration,
    expected,
  }) => {
    expect(calculateStatus(datetime, classes, minDuration)).toStrictEqual(expected);
  });
});

// 3. Datetime >= start

describe('Datetime After Start.', () => {
  test.each([
    // Datetime after start
    {
      datetime: new Date(new Date().setHours(new Date().getHours() + 1)),
      classes: [
        {
          courseCode: '2511',
          start: minutesAfterNow(0),
          end: minutesAfterNow(30),
        },
        {
          courseCode: '2521',
          start: minutesAfterNow(30),
          end: minutesAfterNow(45),
        },
      ],
      minDuration: 0,
      expected: {
        status: 'free',
        endtime: '',
      },
    },
  ])('calculateStatus($datetime, $classes, $minDuration) === $expected', ({
    datetime,
    classes,
    minDuration,
    expected,
  }) => {
    expect(calculateStatus(datetime, classes, minDuration)).toStrictEqual(expected);
  });
});

//      4. Minduration > 0
//      5. Check endtime - datetime <= FIFTEEN_MIN
