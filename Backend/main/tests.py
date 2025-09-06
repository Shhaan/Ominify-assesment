from rest_framework.test import APIClient
import pytest
# Create your tests here.


@pytest.mark.django_db
class EventTests:
    def test_successful_event_upload(self):

        client = APIClient() 
        data = {}
        response = client.post("/events/", data=data) 
        assert "Business details successfully uploaded" in response.data['message']
        assert response.status_code == 201
        assert response.data['error'] is False

    def test_successful_event_upload(self):

        client = APIClient() 
        data = {}
        response = client.post("/events/", data=data) 
        assert "Business details successfully uploaded" in response.data['message']
        assert response.status_code == 201
        assert response.data['error'] is False
    def test_successful_event_upload(self):

        client = APIClient() 
        data = {}
        response = client.post("/events/", data=data) 
        assert "Business details successfully uploaded" in response.data['message']
        assert response.status_code == 201
        assert response.data['error'] is False