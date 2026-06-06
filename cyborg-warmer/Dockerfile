FROM python:3.11-slim

WORKDIR /app

# Layer the install: requirements.txt changes far less often than warmer.py.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY warmer.py .

# stdout flushes immediately so Fly logs surface JSON lines in real time.
ENV PYTHONUNBUFFERED=1

CMD ["python", "warmer.py"]
