# Deploying HokieTrails (Docker & Kubernetes)

HokieTrails is split into independently deployable **microservices**. Each one
is (or is built into) its own Docker container.

## The containers / microservices

| Container       | Image                      | Built from                | Port | Role |
| --------------- | -------------------------- | ------------------------- | ---- | ---- |
| `auth-service`  | `hokietrails/backend`      | `backend/` (`SERVICE=auth`)    | 5000 | Accounts, JWT login, saved bookmarks |
| `trails-service`| `hokietrails/backend`      | `backend/` (`SERVICE=trails`)  | 5000 | Virginia trail catalog |
| `housing-service`| `hokietrails/backend`     | `backend/` (`SERVICE=housing`) | 5000 | Lodges / cabins / campgrounds |
| `api-gateway`   | `nginx:1.27-alpine`        | `deploy/gateway/nginx.conf`| 8080 | Routes `/api/<svc>` to each service |
| `frontend`      | `hokietrails/frontend`     | `frontend/hokie-trails/`  | 3000 | Next.js web app |

The three backend services share **one image**; the `SERVICE` environment
variable (`auth` / `trails` / `housing` / `all`) selects which blueprint the
container mounts. This keeps builds simple while still allowing each service to
scale, deploy and fail independently.

## Local: docker-compose

Bring up the whole stack (3 backend services + gateway + frontend):

```bash
# from the repo root
docker compose build
docker compose up
```

- Frontend:    http://localhost:3000
- API gateway: http://localhost:8080  (e.g. `curl localhost:8080/api/trails/`)
- Direct services: 5001 (auth), 5002 (trails), 5003 (housing)

Tear down (and wipe the JSON data volume):

```bash
docker compose down -v
```

## Building images manually

```bash
# One backend image powers all three services
docker build -t hokietrails/backend:latest ./backend

# Frontend (bake in the public API URL + optional Google Maps key)
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://hokietrails.local/api \
  --build-arg NEXT_PUBLIC_GOOGLE_MAP_API=your_key \
  -t hokietrails/frontend:latest ./frontend/hokie-trails
```

Run a single backend microservice directly:

```bash
docker run -e SERVICE=trails -p 5000:5000 -v hokie-trails-data:/data hokietrails/backend:latest
```

## Kubernetes

The manifests in `deploy/k8s/` create a `hokietrails` namespace with a
Deployment + Service (+ PVC where needed) per microservice, an nginx API
gateway, the frontend, and an Ingress.

```bash
# 1. Build and push images to your registry (or load into a local cluster)
docker build -t hokietrails/backend:latest ./backend
docker build -t hokietrails/frontend:latest ./frontend/hokie-trails

# kind:    kind load docker-image hokietrails/backend:latest hokietrails/frontend:latest
# minikube: minikube image load hokietrails/backend:latest hokietrails/frontend:latest

# 2. Create the JWT secret (overrides the placeholder in 01-secret.yaml)
kubectl apply -f deploy/k8s/00-namespace.yaml
kubectl -n hokietrails create secret generic hokie-secrets \
  --from-literal=SECRET_KEY="$(openssl rand -hex 32)" \
  --dry-run=client -o yaml | kubectl apply -f -

# 3. Apply everything
kubectl apply -f deploy/k8s/

# 4. Check rollout
kubectl -n hokietrails get pods,svc,ingress

# 5. Access (add '127.0.0.1 hokietrails.local' to /etc/hosts if using an
#    ingress controller, or port-forward for a quick test)
kubectl -n hokietrails port-forward svc/frontend 3000:3000
kubectl -n hokietrails port-forward svc/api-gateway 8080:8080
```

Scale a service:

```bash
kubectl -n hokietrails scale deployment/trails-service --replicas=3
```

> **Scaling note:** the services currently persist to JSON files on a
> `ReadWriteOnce` volume, so backend deployments are pinned to 1 replica. The
> storage layer (`backend/hokietrails/storage.py`) exposes a document-style API
> (`find`/`insert`/`update`/`delete`) specifically so it can be swapped for a
> shared database (MongoDB, DynamoDB, Postgres) to unlock horizontal scaling.
> `api-gateway` and `frontend` are stateless and already run multiple replicas.
