from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _create_user():
    response = client.post(
        "/users",
        json={"email": "itemowner@example.com", "name": "Item Owner"},
    )
    return response.json()["id"]


def test_create_and_get_item():
    user_id = _create_user()
    response = client.post(
        "/items",
        json={
            "title": "My Item",
            "description": "A test item",
            "owner_id": user_id,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "My Item"
    assert data["owner_id"] == user_id
    item_id = data["id"]

    response = client.get(f"/items/{item_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "My Item"


def test_create_item_invalid_owner():
    response = client.post(
        "/items",
        json={
            "title": "Orphan Item",
            "description": "No owner",
            "owner_id": 99999,
        },
    )
    assert response.status_code == 404


def test_list_items_pagination():
    response = client.get("/items?skip=0&limit=5")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
