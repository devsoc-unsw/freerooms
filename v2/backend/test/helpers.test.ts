import {getBuildingData, calculateStatus} from "../src/helpers"
import { TimetableData, BuildingDatabase, RoomStatus, Class } from "../src/types";
// -----------------------------------------------------------
// --------------------------DATA-----------------------------

const dates = [
    new Date(),
    new Date()
]

const classes = [

]


// -----------------------------------------------------------
// getBuildingData
// Currently broken :( (Async issue with testing promises/non-blackbox)
/*
describe("getBuildingData", () => {
    test("Default test, 08/04/24", async ()=> {
        const expected =  
            {
              'K-G27': {
                name: 'AGSM',
                id: 'K-G27',
                lat: -33.918158,
                long: 151.23567,
                rooms: [Object]
              },
              'K-J17': {
                name: 'Ainsworth Building',
                id: 'K-J17',
                lat: -33.918305,
                long: 151.231412,
                rooms: [Object]
              },
              'K-D26': {
                name: 'Biological Sciences (North)',
                id: 'K-D26',
                lat: -33.917256,
                long: 151.235254,
                rooms: [Object]
              },
              'K-G6': {
                name: 'Blockhouse',
                id: 'K-G6',
                lat: -33.916921,
                long: 151.226793,
                rooms: [Object]
              },
              'K-E19': {
                name: 'Central Lecture Block',
                id: 'K-E19',
                lat: -33.917272,
                long: 151.232478,
                rooms: [Object]
              },
              'K-F10': {
                name: 'Chemical Sciences',
                id: 'K-F10',
                lat: -33.917115,
                long: 151.228732,
                rooms: [Object]
              },
              'K-H20': {
                name: 'Civil Engineering Building',
                id: 'K-H20',
                lat: -33.918136,
                long: 151.232687,
                rooms: [Object]
              },
              'K-B16': {
                name: 'Colombo Building',
                id: 'K-B16',
                lat: -33.916226,
                long: 151.231301,
                rooms: [Object]
              },
              'K-G17': {
                name: 'Electrical Engineering Bldg',
                id: 'K-G17',
                lat: -33.917842,
                long: 151.231483,
                rooms: [Object]
              },
              'K-D16': {
                name: 'Goldstein Hall',
                id: 'K-D16',
                lat: -33.916604,
                long: 151.231191,
                rooms: [Object]
              },
              'K-F20': {
                name: 'John Goodsell Building',
                id: 'K-F20',
                lat: -33.91741,
                long: 151.23284,
                rooms: [Object]
              },
              'K-G19': {
                name: 'John Niland Scientia',
                id: 'K-G19',
                lat: -33.918002,
                long: 151.23243,
                rooms: [Object]
              },
              'K-J14': {
                name: 'Keith Burrows Theatre',
                id: 'K-J14',
                lat: -33.918101,
                long: 151.2302,
                rooms: [Object]
              },
              'K-F8': {
                name: 'Law Building',
                id: 'K-F8',
                lat: -33.917204,
                long: 151.22796,
                rooms: [Object]
              },
              'K-F21': {
                name: 'Library Stage 2',
                id: 'K-F21',
                lat: -33.917702,
                long: 151.233242,
                rooms: [Object]
              },
              'K-F23': {
                name: 'Mathews Building',
                id: 'K-F23',
                lat: -33.917628,
                long: 151.234366,
                rooms: [Object]
              },
              'K-D23': {
                name: 'Mathews Theatres',
                id: 'K-D23',
                lat: -33.917161,
                long: 151.233983,
                rooms: [Object]
              },
              'K-C20': {
                name: 'Morven Brown Building',
                id: 'K-C20',
                lat: -33.916827,
                long: 151.233154,
                rooms: [Object]
              },
              'K-J12': {
                name: 'Newton Building',
                id: 'K-J12',
                lat: -33.917927,
                long: 151.22929,
                rooms: [Object]
              },
              'K-K15': {
                name: 'Old Main Building',
                id: 'K-K15',
                lat: -33.918674,
                long: 151.230242,
                rooms: [Object]
              },
              'K-K14': {
                name: 'Physics Theatre',
                id: 'K-K14',
                lat: -33.918494,
                long: 151.230229,
                rooms: [Object]
              },
              'K-E15': {
                name: 'Quadrangle Building',
                id: 'K-E15',
                lat: -33.917214,
                long: 151.231209,
                rooms: [Object]
              },
              'K-F17': {
                name: 'Rex Vowels Theatre',
                id: 'K-F17',
                lat: -33.917668,
                long: 151.231539,
                rooms: [Object]
              },
              'K-M15': {
                name: 'Rupert Myers Building',
                id: 'K-M15',
                lat: -33.919238,
                long: 151.230562,
                rooms: [Object]
              },
              'K-E8': {
                name: 'Science & Engineering Building',
                id: 'K-E8',
                lat: -33.916679,
                long: 151.227812,
                rooms: [Object]
              },
              'K-F13': {
                name: 'Science Theatre',
                id: 'K-F13',
                lat: -33.917342,
                long: 151.229811,
                rooms: [Object]
              },
              'K-C24': {
                name: 'Sir John Clancy Auditorium',
                id: 'K-C24',
                lat: -33.916816,
                long: 151.234576,
                rooms: [Object]
              },
              'K-E4': {
                name: 'Squarehouse',
                id: 'K-E4',
                lat: -33.916413,
                long: 151.226369,
                rooms: [Object]
              },
              'K-H13': {
                name: 'The Red Centre',
                id: 'K-H13',
                lat: -33.917898,
                long: 151.230594,
                rooms: [Object]
              },
              'K-H6': {
                name: 'Tyree Energy Technology',
                id: 'K-H6',
                lat: -33.917446,
                long: 151.226608,
                rooms: [Object]
              },
              'K-E12': {
                name: 'UNSW Business School',
                id: 'K-E12',
                lat: -33.916825,
                long: 151.2296,
                rooms: [Object]
              },
              'K-H22': {
                name: 'Vallentine Annexe',
                id: 'K-H22',
                lat: -33.918136,
                long: 151.233631,
                rooms: [Object]
              },
              'K-G14': {
                name: 'Webster Building',
                id: 'K-G14',
                lat: -33.917688,
                long: 151.23067,
                rooms: [Object]
              },
              'K-G15': {
                name: 'Webster Theatres',
                id: 'K-G15',
                lat: -33.917464,
                long: 151.230697,
                rooms: [Object]
              }
            }
        expect(await getBuildingData()).toStrictEqual(expected);
    })
});
*/
// -----------------------------------------------------------
// calculateStatus

/**
 * export type Class = {
  courseCode: string;
  start: string;
  end: string;
};
 */
describe("Variable Classes", () => {
    console.log(new Date());
    test.each([
        {
            datetime: new Date(),
            classes: [],
            minDuration: 0,
            expected: {
                status : "free",
                endtime : ""
            },
        },
        {
            datetime: new Date(),
            classes: [
                {
                    courseCode: '2521',
                    start: new Date().toString(),
                    end : (new Date().setHours(new Date().getMinutes() + 60)).toString(),
                }, 
                {
                    courseCode: '2521',
                    start: new Date().toString(),
                    end : (new Date().setHours(new Date().getMinutes() + 120)).toString(),
                },
                {
                    courseCode: '2521',
                    start: new Date().toString(),
                    end : (new Date().setHours(new Date().getMinutes() + 180)).toString(),
                }
            ],
            minDuration: 0,
            expected: {
                status : "free",
                endtime : ""
            },
        },
    ])('calculateStatus($datetime, $classes, $minDuration) === $expected', ({ datetime, classes, minDuration, expected}) => {
        expect(calculateStatus(datetime, classes, minDuration)).toStrictEqual(expected);
    });
})
// TODO Test with Real Classes
// 1. Find first two classes after
// 2. Datetime < start
// 3. Datetime >= start
//      4. Minduration > 0 
//      5. Check endtime - datetime <= FIFTEEN_MIN

describe("calculateStatus", ()=> {
    test 
})  