from rest_framework import serializers
from .models import Event, Attendee

class EventSerializer(serializers.ModelSerializer):
    converted_time = serializers.SerializerMethodField()
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    def validate(self, attrs):
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')
        if start_time > end_time:
            raise serializers.ValidationError(
            {"end_time": "The ending time must be after the starting time."}
        )
        return attrs
    def get_converted_time(self,obj:Event):
        context = self.context
        if context:
            
            return obj.convert_timeline(timezone_str=context.get('user_location',''))
        else:
            return {}
          

class AttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendee
        fields = '__all__'
        read_only_fields = ['created_at']

    def validate(self, data):
        event = data.get('event')
        email = data.get('email')
        if Attendee.objects.filter(event=event, email=email).exists():
            raise serializers.ValidationError("Email are already registered for this event.")
        if event.attendees.count() >= event.max_capacity:
            raise serializers.ValidationError("Event is already full.")
        return data