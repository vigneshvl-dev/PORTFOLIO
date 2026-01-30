# Use official Python runtime as base image
FROM python:3.9-slim

# Set working directory in container
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Set environment variable for Flask
ENV FLASK_APP=app.py
ENV PORT=5000

# Expose the port
EXPOSE 5000

# Run the application using gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
