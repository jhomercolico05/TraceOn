-- 0004_seed.sql
-- Lookup data only: categories + campus buildings. Safe to re-run.

insert into public.categories (slug, label, icon) values
  ('electronics', 'Electronics', 'hardware-chip-outline'),
  ('ids-cards',   'IDs & Cards', 'card-outline'),
  ('wallets',     'Wallets',     'wallet-outline'),
  ('bags',        'Bags',        'bag-handle-outline'),
  ('books',       'Books',       'book-outline'),
  ('others',      'Others',      'ellipsis-horizontal-circle-outline')
on conflict (slug) do update
  set label = excluded.label,
      icon  = excluded.icon;

-- Coordinates from data/campusMap.js (OpenStreetMap, CvSU Main Campus, Indang).
insert into public.report_locations (code, name, lat, lon, priority) values
  ('ADMIN',          'Administration Building',      14.198874, 120.880926, 1),
  ('LIBRARY',        'Library',                      14.199232, 120.882307, 1),
  ('CANTEEN',        'Canteen',                      14.198908, 120.879433, 3),
  ('ENGINEERING',    'Engineering Building',         14.199424, 120.880679, 2),
  ('CED',            'College of Education',         14.198844, 120.880386, 4),
  ('CAS',            'College of Arts and Sciences', 14.199883, 120.881981, 2),
  ('SCIENCE',        'Science Building',             14.200170, 120.881779, 4),
  ('CEMDS',          'CEMDS',                        14.199129, 120.883074, 3),
  ('REGISTRAR',      'Registrar',                    14.199253, 120.881612, 4),
  ('GYMNASIUM',      'Gymnasium',                    14.196910, 120.878758, 2),
  ('INFIRMARY',      'Infirmary',                    14.197557, 120.879960, 3),
  ('ATHLETIC_FIELD', 'Athletic Field',               14.197926, 120.881450, 1),
  ('HOSTEL',         'Hostel',                       14.200685, 120.882646, 3),
  ('DORMITORY',      'Dormitory',                    14.196584, 120.883408, 3),
  ('MAIN_GATE',      'Main Gate',                    14.196300, 120.880300, 2)
on conflict (code) do update
  set name     = excluded.name,
      lat      = excluded.lat,
      lon      = excluded.lon,
      priority = excluded.priority;
