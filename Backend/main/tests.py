from rest_framework.test import APIClient
import pytest
from .models import *
# Create your tests here.

dummy_data = {
  "name": "Startup Pitch Nigad",
  "location": "WeWork Koramangala, Bangalore",
  "start_time": "2025-09-20T13:30:00Z",
  "end_time": "2025-09-20T21:00:00Z",
  "max_capacity": 2
}

dummy_data_time = {
  "name": "Startup Pitch Nigad",
  "location": "WeWork Koramangala, Bangalore",
  "start_time": "2025-09-20T23:30:00Z",
  "end_time": "2025-09-20T21:00:00Z",
  "max_capacity": 2
}

def create_event():
    a = Event.objects.create(
            name="Startup Pitch Nigad",
            location="WeWork Koramangala, Bangalore",
            start_time="2025-09-20T13:30:00Z",
            end_time="2025-09-20T21:00:00Z",
            max_capacity=2
        )
    return a
@pytest.mark.django_db
class TestEvent:
    def test_successful_event_upload(self):
        client = APIClient()
        
        response = client.post("/events", data=dummy_data)

        assert "Event created successfully" in response.data['data']
        assert response.status_code == 201   # typo: was 291 before
        assert response.data['error'] is False

    def test_event_fail_due_start_time_great(self):

        client = APIClient()  
        response = client.post("/events", data=dummy_data_time) 
        assert "The ending time must be after the starting time" in response.data['data']
        assert response.status_code == 400
        assert response.data['error'] is True

    def test_event_fail_due_not_unique_event(self):
        create_event()
        client = APIClient() 
        data = {}
        response = client.post("/events", data=dummy_data) 
        assert "event with this name already exists." in response.data['data']
        assert response.status_code == 400
        assert response.data['error'] is True

    def test_successful_event_fetch(self):

        client = APIClient()  
        response = client.get(f"/events") 
        assert "No available events" in response.data['data']
        assert response.status_code == 404
        assert response.data['error'] is True

        create_event()
        response = client.get(f"/events") 
        assert response.status_code == 200
        assert response.data['error'] is False


dummy_dataAttende = {
  "event": 3,
  "name": "Bob Smith",
  "email": "boe.smith@example.com"
}

def create_attandees(event):
    a = Attendee.objects.create(event=event,name='Dummy',email='boe.smith@example.com')
    return a

@pytest.mark.django_db
class TestAttandees:
    def test_successful_attandees_upload(self):
        client = APIClient()
        a = create_event()
        dummy_dataAttende['event'] = a.id
        response = client.post("/attendees", data=dummy_dataAttende)

        assert "Attendees created successfully" in response.data['data']
        assert response.status_code == 201   # typo: was 291 before
        assert response.data['error'] is False

    def test_attandees_fail_due_to_duplicate_user(self):

        client = APIClient()  
        a = create_event()
        create_attandees(a)
        dummy_dataAttende['event'] = a.id
        response = client.post("/attendees", data=dummy_dataAttende)
        assert "The fields event, email must make a unique set." in response.data['data']
        assert response.status_code == 400
        assert response.data['error'] is True

    def test_attandees_fail_due_to_maximumfilled(self):

        client = APIClient()  
        a = create_event()
        create_attandees(a)
        dummy_dataAttende['event'] = a.id
        dummy_dataAttende['email'] = 'shs@gmail.com'
        response = client.post("/attendees", data=dummy_dataAttende)
        dummy_dataAttende['email'] = 'sha@gmail.com'
        response = client.post("/attendees", data=dummy_dataAttende) 
        assert "Event is already full." in response.data['data']
        assert response.status_code == 400
        assert response.data['error'] is True

    def test_attandees_fetch(self): 
        client = APIClient()  
        response = client.get("/attendees") 
        assert "Event id is required for fetching attendess" in response.data['data']
        assert response.status_code == 400
        assert response.data['error'] is True

    def test_attandees_fetch(self): 
        client = APIClient()  
        a = create_event()
        response = client.get(f"/attendees?event_id={a.id}") 
        assert "No attendees for this event" in response.data['data']
        assert response.status_code == 404
        assert response.data['error'] is True

    def test_successful_attandees_fetch(self):

        client = APIClient()  
        a = create_event()
        create_attandees(a)
        response = client.get(f"/attendees?event_id={a.id}") 
        assert response.status_code == 200
        assert response.data['error'] is False

          


