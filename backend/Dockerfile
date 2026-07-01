# Single backend image shared by all three microservices.
# The SERVICE env var (auth | trails | housing | all) selects which blueprint
# the container mounts, so one image powers every deployment.
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DATA_DIR=/data \
    PORT=5000 \
    SERVICE=all

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Persist the JSON "databases" outside the image layer.
RUN mkdir -p /data
VOLUME ["/data"]

EXPOSE 5000

# 2 gunicorn workers; SERVICE env decides which blueprint wsgi:app mounts.
CMD ["sh", "-c", "gunicorn -w 2 -b 0.0.0.0:${PORT} wsgi:app"]
