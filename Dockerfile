FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY static/ static/
COPY index.html .
COPY server.py .

EXPOSE 5000

CMD ["python", "server.py"]
