#!/usr/bin/env python3
"""
Simple HTTP server to serve test-regex.html locally
This bypasses CORS issues when opening HTML files directly
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

def main():
    # Get the directory where this script is located
    script_dir = Path(__file__).parent.absolute()
    
    # Change to the script directory
    os.chdir(script_dir)
    
    # Check if test-regex.html exists
    if not Path('test-regex.html').exists():
        print("❌ Error: test-regex.html not found in current directory")
        print("Make sure you're running this script from the RegexLab root directory")
        sys.exit(1)
    
    PORT = 8080
    
    # Create a custom handler to set CORS headers
    class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            super().end_headers()
        
        def do_OPTIONS(self):
            self.send_response(200)
            self.end_headers()
    
    try:
        with socketserver.TCPServer(("", PORT), CORSHTTPRequestHandler) as httpd:
            print(f"🚀 Starting HTTP server on port {PORT}")
            print(f"📁 Serving files from: {script_dir}")
            print(f"🌐 Open your browser and go to: http://localhost:{PORT}/test-regex.html")
            print("")
            print("Press Ctrl+C to stop the server")
            print("=" * 50)
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Error: Port {PORT} is already in use")
            print("Try a different port or stop the process using that port")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 