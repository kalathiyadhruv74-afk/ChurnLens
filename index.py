"""
ChurnLens — Root Handler Entrypoint for Vercel Deployment
"""
from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            "service": "ChurnLens",
            "status": "Healthy",
            "pipeline": "Active"
        }).encode('utf-8'))
        return
