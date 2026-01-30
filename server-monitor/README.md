# ☁️ Server Monitoring Dashboard

A real-time DevOps-style server monitoring application built with **Python (Flask)** and **Psutil**. It displays CPU, RAM usage, and system health metrics on a modern dashboard.

## 🚀 Features
- **Real-time Monitoring**: Live updates every 2 seconds.
- **System Metrics**: Tracks CPU Usage, RAM Usage (GB/%), and Uptime.
- **Alert System**: Visual warnings when resources exceed thresholds (>80%).
- **REST API**: Exposes metrics via a JSON API endpoint `/api/stats`.

## 🛠️ Technology Stack
- **Backend**: Python, Flask
- **System Ops**: Psutil Library
- **Frontend**: HTML5, CSS3 (Modern Tech Design)

## 📦 Installation
1. **Clone the repo**:
   ```bash
   git clone https://github.com/vigneshvl-dev/server-monitoring-dashboard.git
   cd server-monitoring-dashboard
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the App**:
   ```bash
   python app.py
   ```

4. **View Dashboard**:
   Open `http://127.0.0.1:5000` in your browser.

## 🐳 Docker Usage (Optional)
You can containerize this app easily:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
```
