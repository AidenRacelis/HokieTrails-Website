"""Smoke tests for the HokieTrails API using Flask's test client.

Run with the stdlib test runner (no extra dependencies required):

    cd backend
    python -m unittest discover -s tests -v
"""

import tempfile
import unittest
from pathlib import Path

from hokietrails import create_app
from hokietrails.config import Config


class ApiTestCase(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        config = Config(SECRET_KEY="test-secret", DATA_DIR=Path(self._tmp.name))
        # Reset the module-level collection cache so each test gets a fresh DB.
        from hokietrails import storage

        storage._COLLECTION_CACHE.clear()
        self.app = create_app(service="all", config=config)
        self.client = self.app.test_client()

    def tearDown(self):
        self._tmp.cleanup()

    # ------------------------------------------------------------------ trails
    def test_trails_are_seeded(self):
        resp = self.client.get("/api/trails/")
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertGreater(data["count"], 5)
        names = [t["name"] for t in data["trails"]]
        self.assertIn("McAfee Knob", names)

    def test_trail_filtering_and_combined_rating(self):
        resp = self.client.get("/api/trails/?difficulty=hard&sort=rating")
        data = resp.get_json()
        self.assertTrue(all(t["difficulty"] == "hard" for t in data["trails"]))
        self.assertTrue(all("combined_rating" in t for t in data["trails"]))

    def test_get_single_trail(self):
        resp = self.client.get("/api/trails/mcafee-knob")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()["trail"]["town"], "Catawba")

    # ----------------------------------------------------------------- housing
    def test_housing_near_trail(self):
        resp = self.client.get("/api/housing/near/mcafee-knob")
        self.assertEqual(resp.status_code, 200)
        self.assertGreaterEqual(resp.get_json()["count"], 1)

    # -------------------------------------------------------------------- auth
    def _register(self):
        return self.client.post(
            "/api/auth/register",
            json={
                "username": "tester",
                "email": "tester@example.com",
                "password": "supersecret",
            },
        )

    def test_register_login_and_save(self):
        resp = self._register()
        self.assertEqual(resp.status_code, 201)
        token = resp.get_json()["token"]

        # Duplicate registration is rejected.
        self.assertEqual(self._register().status_code, 409)

        # Weak password is rejected.
        weak = self.client.post(
            "/api/auth/register",
            json={"username": "abc", "email": "a@b.com", "password": "short"},
        )
        self.assertEqual(weak.status_code, 400)

        # Login works.
        login = self.client.post(
            "/api/auth/login",
            json={"email": "tester@example.com", "password": "supersecret"},
        )
        self.assertEqual(login.status_code, 200)

        # Saving a trail requires and honors the token.
        headers = {"Authorization": f"Bearer {token}"}
        save = self.client.post("/api/auth/saved/trails/mcafee-knob", headers=headers)
        self.assertEqual(save.status_code, 200)
        self.assertIn("mcafee-knob", save.get_json()["saved_trails"])

        # Protected route rejects missing token.
        self.assertEqual(self.client.get("/api/auth/me").status_code, 401)

    def test_bad_login(self):
        self._register()
        resp = self.client.post(
            "/api/auth/login",
            json={"email": "tester@example.com", "password": "wrongpass"},
        )
        self.assertEqual(resp.status_code, 401)


if __name__ == "__main__":
    unittest.main()
