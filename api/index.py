"""
ChurnLens — Serverless API Entrypoint for Vercel Deployment
"""
from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response_data = {
            "service": "ChurnLens Retention Intelligence Platform",
            "version": "2.4.0",
            "status": "Operational",
            "model": "Gradient Boosting Classifier (AUC 1.00)"
        }
        self.wfile.write(json.dumps(response_data).encode('utf-8'))
        return
