#!/usr/bin/env python3
"""
CSC Rahti Demo Application
A simple Flask web application optimized for CSC Rahti container platform.
"""

import os
import sys
import logging
from datetime import datetime
from flask import Flask, render_template, jsonify, request
import socket
import platform
from dotenv import load_dotenv
from flask_cors import CORS
from flask import send_from_directory

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger(__name__)

load_dotenv() # load .env file to environment

# Create Flask application
app = Flask(__name__, static_folder="mypage/dist", template_folder="templates")
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

# Get environment information
def get_system_info():
    """Get system information for display"""
    return {
        'hostname': socket.gethostname(),
        'platform': platform.platform(),
        'python_version': platform.python_version(),
        'timestamp': datetime.now().isoformat(),
        'environment': {
            'user': os.environ.get('USER', 'unknown'),
            'home': os.environ.get('HOME', 'unknown'),
            'path': os.environ.get('PATH', 'unknown')[:100] + '...',
            'port': os.environ.get('PORT', '8080')
        }
    }

@app.route('/')
def home():
    """Home page route"""
    logger.info("Home page requested")
    system_info = get_system_info()
    return render_template('index.html', system_info=system_info)

@app.route('/mypage')
def mypage():
    return app.send_static_file('react/index.html')

@app.route('/health')
def health_check():
    """Health check endpoint for Kubernetes/OpenShift"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'hostname': socket.gethostname()
    })

@app.route('/ready')
def readiness_check():
    """Readiness check endpoint for Kubernetes/OpenShift"""
    return jsonify({
        'status': 'ready',
        'timestamp': datetime.now().isoformat(),
        'hostname': socket.gethostname()
    })

@app.route('/info')
def info():
    """System information endpoint"""
    return jsonify(get_system_info())

@app.route('/api/data')
def api_data():
    """Sample API endpoint"""
    data = {
        'message': 'Welcome to CSC Rahti Demo Application by Anniina!',
        'data': [
            {'id': 1, 'name': 'First Item', 'value': 42},
            {'id': 2, 'name': 'Second Item', 'value': 84},
            {'id': 3, 'name': 'Third Item', 'value': 126}
        ],
        'timestamp': datetime.now().isoformat(),
        'server': socket.gethostname()
    }
    return jsonify(data)

@app.route('/api/courses')
def courses():
    courses = [
        { "id": 1, "name": "Web Development", "credits": 5 },
        { "id": 2, "name": "Cloud Services", "credits": 5 },
        { "id": 3, "name": "Java Programming", "credits": 5 }
    ] 
    return jsonify(courses)


@app.errorhandler(404)
def not_found(error):
    """404 error handler"""
    return render_template('error.html', 
                         error_code=404, 
                         error_message="Page not found"), 404

@app.errorhandler(500)
def internal_error(error):
    """500 error handler"""
    logger.error(f"Internal server error: {error}")
    return render_template('error.html', 
                         error_code=500, 
                         error_message="Internal server error"), 500

# Tämä route käsittelee kaikki reitit, jotka eivät ole API-reittejä
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
 # Jos pyyntö alkaa 'api/' kanssa, anna Flaskin käsitellä se normaalisti
    if path.startswith('api/'):
        return jsonify({"error": "Not found"}), 404
        
    # Jos tiedosto löytyy build-hakemistosta, palautetaan se
    file_path = os.path.join(app.static_folder, path)
    if path != "" and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    
    # Muuten palautetaan index.html (React sovellus)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Get port from environment variable (Rahti sets this)
    port_str = os.environ.get('PORT')
    if not port_str: # port on None or empty string
        port = 8080 
    else: 
        port = int(port_str)
    
    logger.info(f"Starting CSC Rahti Demo Application on port {port}")
    logger.info(f"System info: {get_system_info()}")
    
    # Run the application
    # Note: In production, this should be run with a proper WSGI server
    # but for demo purposes, Flask's built-in server is sufficient
    app.run(
        host='0.0.0.0',  # Important: bind to all interfaces for containers
        port=port,
        debug=app.config['DEBUG']
    )
