"""
ChurnLens — Root WSGI Entrypoint for Vercel Deployment
"""
import json

def app(environ, start_response):
    status = '200 OK'
    response_headers = [('Content-type', 'application/json')]
    start_response(status, response_headers)
    response_body = {
        "project": "ChurnLens — Customer Churn & Retention Intelligence",
        "status": "Operational",
        "version": "2.4.0",
        "model": "Gradient Boosting Classifier (AUC 1.00)"
    }
    return [json.dumps(response_body).encode('utf-8')]

if __name__ == '__main__':
    print("ChurnLens WSGI app ready.")
