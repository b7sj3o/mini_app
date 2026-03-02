from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_create_and_get_user():
    # Create
    response = client.post(
        "/users",
        json={"email": "test@example.com", "name": "Test User"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"
    assert "id" in data
    user_id = data["id"]

    # Get
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"


def test_create_duplicate_email():
    client.post("/users", json={"email": "dup@example.com", "name": "First"})
    response = client.post("/users", json={"email": "dup@example.com", "name": "Second"})
    assert response.status_code == 400


def test_get_nonexistent_user():
    response = client.get("/users/99999")
    assert response.status_code == 404


def test_list_users():
    response = client.get("/users")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
