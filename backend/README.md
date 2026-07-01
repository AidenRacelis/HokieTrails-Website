# HokieTrails Backend

A Flask REST API for the HokieTrails app: a catalog of hiking trails in the
Commonwealth of Virginia, the lodging alongside them, and user accounts that can
bookmark favorites.

The data is stored in plain **JSON files** (a lightweight document store) under
`data/`. The storage layer (`hokietrails/storage.py`) mimics a document
database (`find` / `insert` / `update` / `delete`) so it can later be swapped
for MongoDB / DynamoDB / Postgres without touching the API code.

## Services

The API is split into three logical services, each exposed as a Flask blueprint
so it can be deployed as its own microservice / container:

| Service   | Prefix          | Responsibility                                  |
| --------- | --------------- | ----------------------------------------------- |
| `auth`    | `/api/auth`     | Register, login (JWT), profile, saved bookmarks |
| `trails`  | `/api/trails`   | Virginia hiking trail catalog + filtering       |
| `housing` | `/api/housing`  | Lodges / cabins / campgrounds near trails       |

Select which service a process mounts with the `SERVICE` environment variable
(`auth`, `trails`, `housing`, or `all`). `all` runs everything in one process
(the local-dev monolith).

## Running locally

```bash
cd backend
pip install --user -r requirements.txt   # or use a virtualenv
cp .env.example .env                      # optional
python app.py                             # http://localhost:5000
```

Run a single service:

```bash
SERVICE=trails python app.py
```

Run with gunicorn (production):

```bash
SERVICE=trails gunicorn -w 2 -b 0.0.0.0:5000 wsgi:app
```

## Tests

```bash
cd backend
python -m unittest discover -s tests -v
```

## Data model

### Trail

```jsonc
{
  "id": "mcafee-knob",
  "name": "McAfee Knob",
  "town": "Catawba",
  "county": "Roanoke County",
  "state": "Virginia",
  "coordinates": { "lat": 37.3917, "lng": -80.0367, "x": -80.0367, "y": 37.3917 },
  "length_miles": 8.8,
  "elevation_gain_ft": 1740,
  "highest_elevation_ft": 3197,
  "difficulty": "medium",            // easy | medium | hard
  "elevation_difficulty": "sustained climb",
  "ratings": {
    "google":    { "rating": 4.8, "reviews": 3120 },
    "alltrails": { "rating": 4.8, "reviews": 4890 }
  },
  "routes": [
    { "name": "...", "distance_miles": 8.8, "difficulty": "medium",
      "elevation_gain_ft": 1740, "type": "out-and-back", "description": "..." }
  ]
}
```

`combined_rating` is computed on the fly as a review-weighted average of the
Google and AllTrails ratings.

### Housing

```jsonc
{
  "id": "peaks-of-otter-lodge",
  "name": "Peaks of Otter Lodge",
  "type": "lodge",                    // lodge | cabin | campground | hotel
  "town": "Bedford",
  "coordinates": { "lat": 37.4487, "lng": -79.6035, "x": -79.6035, "y": 37.4487 },
  "price_per_night": 165,
  "rating": 4.4,
  "amenities": ["lakefront", "restaurant"],
  "nearby_trail_ids": ["sharp-top"]
}
```

## Endpoints

### Auth (`/api/auth`)

| Method | Path                        | Auth | Description                    |
| ------ | --------------------------- | ---- | ------------------------------ |
| POST   | `/register`                 | -    | Create account, returns JWT    |
| POST   | `/login`                    | -    | Login, returns JWT             |
| GET    | `/me`                       | ✓    | Current user profile           |
| GET    | `/saved`                    | ✓    | Saved trail + housing ids      |
| POST   | `/saved/trails/<id>`        | ✓    | Bookmark a trail               |
| DELETE | `/saved/trails/<id>`        | ✓    | Remove a bookmarked trail      |
| POST   | `/saved/housing/<id>`       | ✓    | Bookmark a housing option      |
| DELETE | `/saved/housing/<id>`       | ✓    | Remove a bookmarked housing    |

### Trails (`/api/trails`)

| Method | Path        | Auth | Description                                                       |
| ------ | ----------- | ---- | ---------------------------------------------------------------- |
| GET    | `/`         | -    | List/filter (`q`,`difficulty`,`town`,`min_rating`,`max_length`,`sort`,`limit`) |
| GET    | `/towns`    | -    | Distinct towns                                                   |
| GET    | `/<id>`     | -    | Single trail                                                     |
| POST   | `/`         | ✓    | Create trail                                                     |
| PUT    | `/<id>`     | ✓    | Update trail                                                     |
| DELETE | `/<id>`     | ✓    | Delete trail                                                     |

### Housing (`/api/housing`)

| Method | Path              | Auth | Description                                          |
| ------ | ----------------- | ---- | ---------------------------------------------------- |
| GET    | `/`               | -    | List/filter (`q`,`town`,`type`,`max_price`,`min_rating`,`sort`) |
| GET    | `/<id>`           | -    | Single housing option                                |
| GET    | `/near/<trailId>` | -    | Housing linked to a trail                            |
| POST   | `/`               | ✓    | Create housing option                                |
| PUT    | `/<id>`           | ✓    | Update housing option                                |
| DELETE | `/<id>`           | ✓    | Delete housing option                                |

Authenticated requests must send `Authorization: Bearer <token>`.
