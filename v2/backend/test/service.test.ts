import { getAllBuildings, getAllRoomStatus, getRoomBookings } from "../src/service"; 

/**
 * Tests REMOVED for non black-box nature. 

describe("getAllBuildings", ()=> {
    test("Data, 01/04/23", async() => {
        const data = await getAllBuildings();
        expect(data).toStrictEqual([
            { name: 'AGSM', id: 'K-G27', lat: -33.918158, long: 151.23567 },
            {
              name: 'Ainsworth Building',
              id: 'K-J17',
              lat: -33.918305,
              long: 151.231412
            },
            {
              name: 'Biological Sciences (North)',
              id: 'K-D26',
              lat: -33.917256,
              long: 151.235254
            },
            { name: 'Blockhouse', id: 'K-G6', lat: -33.916921, long: 151.226793 },
            {
              name: 'Central Lecture Block',
              id: 'K-E19',
              lat: -33.917272,
              long: 151.232478
            },
            {
              name: 'Chemical Sciences',
              id: 'K-F10',
              lat: -33.917115,
              long: 151.228732
            },
            {
              name: 'Civil Engineering Building',
              id: 'K-H20',
              lat: -33.918136,
              long: 151.232687
            },
            {
              name: 'Colombo Building',
              id: 'K-B16',
              lat: -33.916226,
              long: 151.231301
            },
            {
              name: 'Electrical Engineering Bldg',
              id: 'K-G17',
              lat: -33.917842,
              long: 151.231483
            },
            {
              name: 'Goldstein Hall',
              id: 'K-D16',
              lat: -33.916604,
              long: 151.231191
            },
            {
              name: 'John Goodsell Building',
              id: 'K-F20',
              lat: -33.91741,
              long: 151.23284
            },
            {
              name: 'John Niland Scientia',
              id: 'K-G19',
              lat: -33.918002,
              long: 151.23243
            },
            {
              name: 'Keith Burrows Theatre',
              id: 'K-J14',
              lat: -33.918101,
              long: 151.2302
            },
            {
              name: 'Law Building',
              id: 'K-F8',
              lat: -33.917204,
              long: 151.22796
            },
            {
              name: 'Library Stage 2',
              id: 'K-F21',
              lat: -33.917702,
              long: 151.233242
            },
            {
              name: 'Mathews Building',
              id: 'K-F23',
              lat: -33.917628,
              long: 151.234366
            },
            {
              name: 'Mathews Theatres',
              id: 'K-D23',
              lat: -33.917161,
              long: 151.233983
            },
            {
              name: 'Morven Brown Building',
              id: 'K-C20',
              lat: -33.916827,
              long: 151.233154
            },
            {
              name: 'Newton Building',
              id: 'K-J12',
              lat: -33.917927,
              long: 151.22929
            },
            {
              name: 'Old Main Building',
              id: 'K-K15',
              lat: -33.918674,
              long: 151.230242
            },
            {
              name: 'Physics Theatre',
              id: 'K-K14',
              lat: -33.918494,
              long: 151.230229
            },
            {
              name: 'Quadrangle Building',
              id: 'K-E15',
              lat: -33.917214,
              long: 151.231209
            },
            {
              name: 'Rex Vowels Theatre',
              id: 'K-F17',
              lat: -33.917668,
              long: 151.231539
            },
            {
              name: 'Rupert Myers Building',
              id: 'K-M15',
              lat: -33.919238,
              long: 151.230562
            },
            {
              name: 'Science & Engineering Building',
              id: 'K-E8',
              lat: -33.916679,
              long: 151.227812
            },
            {
              name: 'Science Theatre',
              id: 'K-F13',
              lat: -33.917342,
              long: 151.229811
            },
            {
              name: 'Sir John Clancy Auditorium',
              id: 'K-C24',
              lat: -33.916816,
              long: 151.234576
            },
            {
              name: 'Squarehouse',
              id: 'K-E4',
              lat: -33.916413,
              long: 151.226369
            },
            {
              name: 'The Red Centre',
              id: 'K-H13',
              lat: -33.917898,
              long: 151.230594
            },
            {
              name: 'Tyree Energy Technology',
              id: 'K-H6',
              lat: -33.917446,
              long: 151.226608
            },
            {
              name: 'UNSW Business School',
              id: 'K-E12',
              lat: -33.916825,
              long: 151.2296
            },
            {
              name: 'Vallentine Annexe',
              id: 'K-H22',
              lat: -33.918136,
              long: 151.233631
            },
            {
              name: 'Webster Building',
              id: 'K-G14',
              lat: -33.917688,
              long: 151.23067
            },
            {
              name: 'Webster Theatres',
              id: 'K-G15',
              lat: -33.917464,
              long: 151.230697
            }
          ]);
    });
})

*/