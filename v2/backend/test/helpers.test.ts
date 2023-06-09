import { calculateStatus } from '../src/helpers';
// -----------------------------------------------------------
// --------------------------DATA-----------------------------

// Randomly selected base date - midday on May 26, 2023
const BASE_DATE = new Date('2023-05-26T12:00:00.000');

// -----------------------------------------------------------
// --------------------------HELPERS--------------------------

function baseDate(): Date {
  return new Date(BASE_DATE);
}

function yearFromBase(): Date {
  const newDate = baseDate();
  newDate.setFullYear(baseDate().getFullYear() + 1);
  return newDate;
}

function minutesFromBase(num: number): string {
  return new Date(
    baseDate().setMinutes(baseDate().getMinutes() + num)
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

// Issue: 
// calculateStatus will use the current date time passed in to do its calculations.
// 
describe('Variable Classes', () => {
  console.log(baseDate());

  test.each([
    // No Classes Whatsoever
    {
      datetime: baseDate(),
      classes: [],
      minDuration: 0,
      expected: {
        status: "free",
        endtime: "",
      },
    },
    {
      datetime: baseDate(),
      classes: [
        {
          courseCode: '2521',
          start: baseDate().toISOString(),
          end: minutesFromBase(60),
        },
        {
          courseCode: '2521',
          start: baseDate().toISOString(),
          end: minutesFromBase(120),
        },
        {
          courseCode: '2521',
          start: baseDate().toISOString(),
          end: minutesFromBase(180),
        },
      ],
      minDuration: 0,
      expected: {
        status: "free",
        endtime: "",
        
      },
    },
  ])('calculateStatus($datetime, $classes, $minDuration) === $expected', ({
    datetime,
    classes,
    minDuration,
    expected,
  }) => {
   
    expect(calculateStatus(datetime, classes, minDuration)).toEqual(expected);
  });
});

// TODO Test with Real Classes
// 1. Find first two classes after
describe('Multi-class calculateStatus', () => {
  test.each([
    // Three classes; All start at the same time, but with different end times.
    {
      datetime: baseDate(),
      classes: [
        {
          courseCode: '2521',
          start: minutesFromBase(0),
          end: minutesFromBase(60),
        },
        {
          courseCode: '2521',
          start: minutesFromBase(0),
          end: minutesFromBase(120),
        },
        {
          courseCode: '2521',
          start: minutesFromBase(0),
          end: minutesFromBase(180),
        },
      ],
      minDuration: 0,
      expected: {
        status: 'free',
        endtime: yearFromBase(),
      },
    },
    // Multi-Classes, ending days after
    {

      datetime: baseDate(),
      classes: [
        {
          courseCode: '2521',
          start: minutesFromBase(0),
          end: minutesFromBase(120),
        },
        {
          courseCode: '2521',
          start: minutesFromBase(0),
          end: minutesFromBase(480),
        },
        {
          courseCode: '2521',
          start: minutesFromBase(0),
          end: minutesFromBase(ONE_DAY_MINUTES),
        },
      ],
      minDuration: 0,
      expected: {
        status: 'free',
        endtime: yearFromBase(),
      },
    },
  ])('calculateStatus($datetime, $classes, $minDuration) === $expected', ({
    datetime,
    classes,
    minDuration,
    expected,
  }) => {
    expect(calculateStatus(datetime, classes, minDuration)).toEqual(expected);
  });
});

// TODO: More tests
// 2. Datetime < start
describe('Datetime before the start.', () => {
  test.each([
    // Two classes; An hour of free time between now, end of first and beginning of second.
    {
      datetime: baseDate(),
      classes: [
        {
          courseCode: '1531',
          start: minutesFromBase(0),
          end: minutesFromBase(60),
        },
        {
          courseCode: '1531',
          start: minutesFromBase(120),
          end: minutesFromBase(240),
        },
      ],
      minDuration: 60,
      expected: {
        status: 'busy',
        // TODO: What is the endtime?
        // Currently set to yearFromBase()
        endtime: yearFromBase(),
      },
    },
    // 3 Classes Afterwards, all beginning after datetime.
    // Should not be free!
    {
      datetime: baseDate(),
      classes: [
        {
          courseCode: '1531',
          start: minutesFromBase(60),
          end: minutesFromBase(120),
        },
        {
          courseCode: '1531',
          start: minutesFromBase(120),
          end: minutesFromBase(240),
        },
        {
          courseCode: '1531',
          start: minutesFromBase(240),
          end: minutesFromBase(480),
        },
      ],
      minDuration: 60,
      expected: {
        status: 'busy',
        // TODO: Fix endtime...
        // Endtime varies dependant on baseDate. (Repair for current basedate)
        endtime: '',
      },
    },
  ])('calculateStatus($datetime, $classes, $minDuration) === $expected', ({
    datetime,
    classes,
    minDuration,
    expected,
  }) => {
    expect(calculateStatus(datetime, classes, minDuration)).toEqual(expected);
  });
});

// 3. Datetime >= start

describe('Datetime After Start.', () => {
  test.each([
    // Datetime after start
    {
      // 1 Hour Ahead
      datetime: new Date(baseDate().setMinutes(baseDate().getMinutes() + 60)),
      classes: [
        {
          courseCode: '2511',
          start: minutesFromBase(0),
          end: minutesFromBase(30),
        },
        {
          courseCode: '2521',
          start: minutesFromBase(30),
          end: minutesFromBase(45),
        },
      ],
      minDuration: 0,
      expected: {
        status: 'free',
        // Should fail! TODO: Change from Empty
        endtime: '',
      },
    },
  ])('calculateStatus($datetime, $classes, $minDuration) === $expected', ({
    datetime,
    classes,
    minDuration,
    expected,
  }) => {
    expect(calculateStatus(datetime, classes, minDuration)).toEqual(expected);
  });
});

//      4. Minduration > 0
//      5. Check endtime - datetime <= FIFTEEN_MIN
