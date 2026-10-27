"""Local preview; --open launches the default browser. No dependencies."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os, sys, webbrowser, threading

def main():
    os.chdir(Path(__file__).resolve().parents[1] / 'preview')
    try:
        server = ThreadingHTTPServer(('127.0.0.1', 8000), SimpleHTTPRequestHandler)
    except OSError:
        server = ThreadingHTTPServer(('127.0.0.1', 0), SimpleHTTPRequestHandler)
    address = f'http://127.0.0.1:{server.server_port}/'
    print(f'Preview: {address}\nKeep this window open. Press Control+C to stop.\n', flush=True)
    if '--open' in sys.argv:
        threading.Timer(0.5, webbrowser.open, args=(address,)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__ == '__main__':
    main()
