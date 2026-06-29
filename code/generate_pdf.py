import http.server
import socketserver
import threading
import os
import sys
import time
from playwright.sync_api import sync_playwright

PORT = 8000

def start_server(root_dir):
    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            pass # Suppress standard server logging to keep output clean

    # Bind the handler to serve files from the workspace root dir
    handler = QuietHandler
    # In older python versions, we change directory inside the server thread
    # but since Python 3.7 we can use the directory parameter
    os.chdir(root_dir)
    
    httpd = socketserver.TCPServer(("", PORT), handler)
    print(f"Background HTTP server started on port {PORT} (serving {root_dir})")
    
    server_thread = threading.Thread(target=httpd.serve_forever)
    server_thread.daemon = True
    server_thread.start()
    return httpd

def generate_pdf():
    # The script is located in workspace/code/generate_pdf.py
    # Root dir is the parent of code/
    code_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(code_dir)
    
    # Start server
    server = start_server(root_dir)
    
    try:
        with sync_playwright() as p:
            print("Launching Playwright browser (Chromium)...")
            try:
                browser = p.chromium.launch()
            except Exception as e:
                print("Failed to launch chromium. Installing playwright dependencies...")
                # Try to install chromium
                import subprocess
                subprocess.run([sys.executable, "-m", "playwright", "install", "chromium"], check=True)
                browser = p.chromium.launch()
                
            page = browser.new_page()
            
            # Navigate to the HTML page via local server
            url = f"http://localhost:{PORT}/code/index.html"
            print(f"Navigating to {url}...")
            page.goto(url, wait_until="load")
            
            # Wait for 3D model spinner to hide (indicates model is loaded and WebGL initialized)
            print("Waiting for the 3D model loading spinner to be hidden...")
            page.wait_for_selector("#loading-spinner", state="hidden", timeout=60000)
            
            # Give the WebGL renderer a small moment to complete drawing buffer
            print("Allowing WebGL renderer to draw (1.5s)...")
            page.wait_for_timeout(1500)
            
            # Output PDF file in root directory
            pdf_path = os.path.join(root_dir, "Bao_cao_giai_phap_Vinfast_Murrplastik.pdf")
            print(f"Generating PDF: {pdf_path}...")
            
            # Generate A4 PDF with custom print margin
            page.pdf(
                path=pdf_path,
                format="A4",
                print_background=True,
                margin={
                    "top": "15mm",
                    "bottom": "15mm",
                    "left": "15mm",
                    "right": "15mm"
                }
            )
            
            print(f"PDF generated successfully! Size: {os.path.getsize(pdf_path)} bytes")
            browser.close()
            
    except Exception as e:
        print(f"Error during PDF generation: {e}")
    finally:
        print("Shutting down HTTP server...")
        server.shutdown()
        server.server_close()
        print("Server stopped.")

if __name__ == "__main__":
    generate_pdf()
