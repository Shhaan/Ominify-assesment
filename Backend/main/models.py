from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
import pytz

class Event(models.Model):
    name = models.CharField(max_length=255,unique=True)
    location = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    max_capacity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError("End time must be after start time.")
    
    def __str__(self):
        return self.name
    def convert_timeline(self, timezone_str="Asia/Kolkata"):
        """
        Convert event start and end times into the given timezone.
        Default: Asia/Kolkata (IST)
        """
        tz = pytz.timezone(timezone_str)
        return {
            "start_time": self.start_time.astimezone(tz),
            "end_time": self.end_time.astimezone(tz)
        }

class Attendee(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attendees')
    name = models.CharField(max_length=255)
    email = models.EmailField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'email')   

    def save(self, *args, **kwargs):
        if self.event.attendees.count() >= self.event.max_capacity:
            raise ValidationError("Event is full.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.email})"
