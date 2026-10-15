"""Локальный запуск игры: python3 run_local.py, затем открыть http://localhost:8000"""
import http.server
import os
import threading
import webbrowser

PORT = 8000
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path in ("/", "/index.html"):
            self.path = "/moon_january.html"
        return super().do_GET()

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    url = f"http://localhost:{PORT}/"
    try:
        print(f"Игра запущена: {url}  (закройте это окно, чтобы остановить)")
    except UnicodeEncodeError:
        print(f"Game is running: {url}")
    threading.Timer(1.0, webbrowser.open, [url]).start()
    server.serve_forever()
