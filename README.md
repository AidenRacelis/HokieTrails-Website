# HokieTrails

Discover hiking trails across the Commonwealth of **Virginia** — with difficulty
ratings from Google & AllTrails, every route, an interactive map, user accounts,
and the lodges/cabins/campgrounds located alongside each trail.

Built as a set of microservices: a Flask REST API (backed by JSON document
stores) and a Next.js frontend.

## Architecture

```
                    ┌────────────────┐
  Browser  ───────► │  Next.js (3000)│
                    └───────┬────────┘
                            │ /api/*
                    ┌───────▼────────┐
                    │  API gateway   │  (nginx :8080)
                    └───┬───┬────┬───┘
              /api/auth │   │trails │ /api/housing
                    ┌───▼─┐ ┌▼────┐ ┌▼──────┐
                    │auth │ │trail│ │housing│  Flask blueprints,
                    │svc  │ │svc  │ │svc    │  one image, SERVICE env
                    └──┬──┘ └──┬──┘ └───┬───┘
                       │ users │ trails │ housing   (JSON databases)
```

- **Backend** (`backend/`): Flask API with three blueprints — `auth`, `trails`,
  `housing` — that can run together (monolith) or as separate microservices.
  Data lives in JSON files under `backend/data/`. See `backend/README.md`.
- **Frontend** (`frontend/hokie-trails/`): Next.js 15 app (App Router) with the
  map, trail browser, lodges, saved bookmarks, and login/registration.
- **Deploy** (`deploy/`): `docker-compose.yml`, per-service Dockerfiles, an
  nginx API gateway, and Kubernetes manifests. See `deploy/README.md`.

## Quick start (local, no Docker)

Backend:

```bash
cd backend
pip install --user -r requirements.txt
python app.py            # http://localhost:5000
```

Frontend (in another terminal):

```bash
cd frontend/hokie-trails
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL / Google Maps key
npm run dev              # http://localhost:3000
```

## Quick start (Docker microservices)

```bash
docker compose up --build
# frontend http://localhost:3000, gateway http://localhost:8080
```

## Kubernetes

```bash
kubectl apply -f deploy/k8s/
```

Full instructions and the list of containerized microservices are in
[`deploy/README.md`](deploy/README.md).

## Tests

```bash
cd backend && python -m unittest discover -s tests -v
cd frontend/hokie-trails && npm run lint && npm run build
```
