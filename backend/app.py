"""Local development runner.

    $ cd backend
    $ python app.py

Runs the full monolith (all services) on http://localhost:5000.
Set SERVICE=auth|trails|housing to run a single service.
"""

import os

from hokietrails import create_app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
