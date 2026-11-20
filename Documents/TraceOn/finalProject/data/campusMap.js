/**
 * CvSU Main Campus (Indang) map data.
 *
 * Coordinates come from OpenStreetMap so the pins line up with the real
 * buildings. Building points are used for the small campus labels; item pins
 * are the demo lost/found reports shown on the map.
 */

export const CAMPUS = {
  name: 'CvSU Main Campus',
  center: [14.19845, 120.88105],
  // The teaching core of the Don Severino De Las Alas (Main) campus:
  // from the gym and main gate in the south-west to CEMDS and the dorms
  // in the north-east. Kept tight so the buildings are readable on a phone.
  bounds: [
    [14.1956, 120.8783],
    [14.2013, 120.8838],
  ],
}

export const BUILDINGS = [
  { name: 'ADMIN', lat: 14.198874, lon: 120.880926, priority: 1 },
  { name: 'LIBRARY', lat: 14.199232, lon: 120.882307, priority: 1 },
  { name: 'CANTEEN', lat: 14.198908, lon: 120.879433, priority: 3 },
  { name: 'ENGINEERING', lat: 14.199424, lon: 120.880679, priority: 2 },
  { name: 'CED', lat: 14.198844, lon: 120.880386, priority: 4 },
  { name: 'CAS', lat: 14.199883, lon: 120.881981, priority: 2 },
  { name: 'SCIENCE', lat: 14.20017, lon: 120.881779, priority: 4 },
  { name: 'CEMDS', lat: 14.199129, lon: 120.883074, priority: 3 },
  { name: 'REGISTRAR', lat: 14.199253, lon: 120.881612, priority: 4 },
  { name: 'GYMNASIUM', lat: 14.19691, lon: 120.878758, priority: 2 },
  { name: 'INFIRMARY', lat: 14.197557, lon: 120.87996, priority: 3 },
  { name: 'ATHLETIC FIELD', lat: 14.197926, lon: 120.88145, priority: 1 },
  { name: 'HOSTEL', lat: 14.200685, lon: 120.882646, priority: 3 },
  { name: 'DORMITORY', lat: 14.196584, lon: 120.883408, priority: 3 },
  { name: 'MAIN GATE', lat: 14.1963, lon: 120.8803, priority: 2 },
]

export const ITEMS = [
  {
    id: 'p1',
    title: 'Navy blue backpack',
    place: 'Library · 2nd floor study area',
    type: 'lost',
    lat: 14.199232,
    lon: 120.882307,
  },
  {
    id: 'p2',
    title: 'Student ID card',
    place: 'Canteen · front lobby',
    type: 'found',
    lat: 14.198908,
    lon: 120.879433,
  },
  {
    id: 'p3',
    title: 'Black umbrella',
    place: 'Gymnasium · entrance',
    type: 'lost',
    lat: 14.19691,
    lon: 120.878758,
  },
  {
    id: 'p4',
    title: 'Silver phone',
    place: 'Engineering · room 204',
    type: 'found',
    lat: 14.199424,
    lon: 120.880679,
  },
  {
    id: 'p5',
    title: 'Water bottle',
    place: 'Main gate · guard house',
    type: 'lost',
    lat: 14.1963,
    lon: 120.8803,
  },
  {
    id: 'p6',
    title: 'Scientific calculator',
    place: 'CAS · room 118',
    type: 'found',
    lat: 14.199883,
    lon: 120.881981,
  },
  {
    id: 'p7',
    title: 'AirPods case',
    place: 'Athletic field · bleachers',
    type: 'lost',
    lat: 14.197926,
    lon: 120.88145,
  },
  {
    id: 'p8',
    title: 'Foldable umbrella',
    place: 'Administration · lobby',
    type: 'found',
    lat: 14.198874,
    lon: 120.880926,
  },
  {
    id: 'p9',
    title: 'Green ID lace',
    place: 'CEMDS · hallway',
    type: 'lost',
    lat: 14.199129,
    lon: 120.883074,
  },
  {
    id: 'p10',
    title: 'Spiral notebook',
    place: 'CED · room 305',
    type: 'found',
    lat: 14.198844,
    lon: 120.880386,
  },
]
