def make_space(client, **over):
    payload = {"name": "Sala 1", "capacity": 10, "location": "Prédio A"}
    payload.update(over)
    return client.post("/spaces", json=payload).json()


def make_reservation(client, space_id, start="10:00", end="11:00", **over):
    payload = {
        "space_id": space_id,
        "requester_name": "Ana",
        "requester_email": "ana@email.com",
        "reservation_date": "2026-12-01",
        "start_time": start,
        "end_time": end,
    }
    payload.update(over)
    return client.post("/reservations", json=payload)


def test_create_and_filter_spaces(client):
    make_space(client, name="Lab 1", capacity=30)
    make_space(client, name="Sala 2", capacity=5)
    r = client.get("/spaces", params={"min_capacity": 20})
    assert [s["name"] for s in r.json()] == ["Lab 1"]


def test_overlapping_reservation_is_rejected(client):
    space = make_space(client)
    assert make_reservation(client, space["id"]).status_code == 201
    r = make_reservation(client, space["id"], start="10:30", end="11:30")
    assert r.status_code == 409


def test_adjacent_reservations_are_allowed(client):
    space = make_space(client)
    make_reservation(client, space["id"], start="10:00", end="11:00")
    assert (
        make_reservation(client, space["id"], start="11:00", end="12:00").status_code
        == 201
    )


def test_cancelled_reservation_does_not_block(client):
    space = make_space(client)
    res = make_reservation(client, space["id"]).json()
    assert (
        client.patch(f"/reservations/{res['id']}/cancel").json()["status"]
        == "cancelled"
    )
    assert make_reservation(client, space["id"]).status_code == 201


def test_cannot_reserve_inactive_space(client):
    space = make_space(client, is_active=False)
    assert make_reservation(client, space["id"]).status_code == 422


def test_end_before_start_rejected(client):
    space = make_space(client)
    assert (
        make_reservation(client, space["id"], start="12:00", end="11:00").status_code
        == 422
    )


def test_update_nonexistent_reservation(client):
    assert (
        client.put("/reservations/999", json={"requester_name": "X"}).status_code == 404
    )


def test_update_rechecks_availability(client):
    space = make_space(client)
    make_reservation(client, space["id"], start="10:00", end="11:00")
    second = make_reservation(client, space["id"], start="12:00", end="13:00").json()
    r = client.put(f"/reservations/{second['id']}", json={"start_time": "10:30"})
    assert r.status_code == 409


def test_update_can_keep_own_slot(client):
    space = make_space(client)
    res = make_reservation(client, space["id"]).json()
    r = client.put(f"/reservations/{res['id']}", json={"requester_name": "Beatriz"})
    assert r.status_code == 200


def test_cannot_delete_space_with_reservations(client):
    space = make_space(client)
    make_reservation(client, space["id"])
    assert client.delete(f"/spaces/{space['id']}").status_code == 409


def test_delete_space_without_reservations(client):
    space = make_space(client)
    assert client.delete(f"/spaces/{space['id']}").status_code == 204
