from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        # Handle favicon and apple-touch-icon requests
        if self.path in ['/favicon.ico', '/apple-touch-icon.png', '/apple-touch-icon-precomposed.png']:
            self.send_response(204)  # No content
            self.end_headers()
            return

        # If no file is specified, serve index.html
        if self.path == '/':
            self.path = '/index.html'
        
        try:
            # Try to serve the file
            return super().do_GET()
        except Exception as e:
            print(f"Error serving {self.path}: {str(e)}")
            self.send_error(404, f"File not found: {self.path}")

def run_server(port=3000):
    try:
        # Get the directory containing this script
        current_dir = os.path.dirname(os.path.abspath(__file__))
        # Change to the parent directory to access Frontend folder
        parent_dir = os.path.dirname(current_dir)
        frontend_dir = os.path.join(parent_dir, "Frontend")
        # Change to frontend directory
        os.chdir(frontend_dir)
        
        server_address = ('localhost', port)
        httpd = HTTPServer(server_address, CORSRequestHandler)
        print(f"Starting frontend server at http://localhost:{port}")
        print(f"Serving files from: {frontend_dir}")
        print("Available files:")
        for file in os.listdir(frontend_dir):
            if os.path.isfile(file):
                print(f"  - {file}")
        print("\nPress Ctrl+C to stop the server")
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()
    except Exception as e:
        print(f"Error starting server: {str(e)}")

if __name__ == "__main__":
    run_server() 