from flask import Flask, render_template, jsonify
import psutil
import datetime

app = Flask(__name__)

# Threshold for alerts
CPU_THRESHOLD = 80
RAM_THRESHOLD = 80

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/stats')
def stats():
    # Collect system metrics
    cpu_percent = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory()
    
    # Check for alerts
    alerts = []
    if cpu_percent > CPU_THRESHOLD:
        alerts.append(f"High CPU Usage: {cpu_percent}%")
    if ram.percent > RAM_THRESHOLD:
        alerts.append(f"High RAM Usage: {ram.percent}%")
        
    return jsonify({
        "cpu": cpu_percent,
        "ram": ram.percent,
        "ram_used": round(ram.used / (1024**3), 2),
        "ram_total": round(ram.total / (1024**3), 2),
        "uptime": str(datetime.datetime.now() - datetime.datetime.fromtimestamp(psutil.boot_time())).split('.')[0],
        "alerts": alerts,
        "status": "Healthy" if not alerts else "Warning"
    })

if __name__ == '__main__':
    print("Server Monitor starting on http://127.0.0.1:5000")
    app.run(debug=True)
