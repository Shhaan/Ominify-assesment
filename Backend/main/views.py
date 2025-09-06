from .utils import getPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import *
from .models import *

# Create your views here.


class EventsView(APIView):
    def post(self,request):
        data = request.data
        serilizer = EventSerializer(data=data)
        if serilizer.is_valid():
            serilizer.save()
            return Response({'data':'Event created successfully ','error':False},status=status.HTTP_201_CREATED)
        else:
            return Response({'data':f'{serilizer.errors}','error':True},status=status.HTTP_400_BAD_REQUEST)
    def get(self,requset):
        event_name = requset.GET.get('event_name')
        user_location = requset.GET.get('user_location')

        is_paginated = True if requset.GET.get('is_paginated') in ['1',True,'true'] else False

        event = Event.objects.all()
        if event_name:
            event = event.filter(name__icontains=event_name)

        if not event.exists():
            return Response({'data':'No available events','error':True},status=status.HTTP_404_NOT_FOUND)
        context  = None
        if user_location:
            context = {'user_location':user_location}
        if is_paginated:
            return Response({"data":getPagination(event,request=requset,Serializer=EventSerializer,context=context),"error":False},status=status.HTTP_200_OK)
            
        else:
            return Response({'data': EventSerializer(event,many=True,context=context).data, "error":False},status=status.HTTP_200_OK)

          
            
class AttendeesView(APIView):
    def post(self,request):
        data = request.data
        serilizer = AttendeeSerializer(data=data)
        if serilizer.is_valid():
            serilizer.save()
            return Response({'data':'Attendees created successfully ','error':False},status=status.HTTP_201_CREATED)
        else:
            return Response({'data':f'{serilizer.errors}','error':True},status=status.HTTP_400_BAD_REQUEST)
    def get(self,requset):
        event_id = requset.GET.get('event_id')
        is_paginated = True if requset.GET.get('is_paginated') in ['1',True,'true'] else False

        if not event_id:
            return Response({'data':'Event id is required for fetching attendess','error':True},status=status.HTTP_400_BAD_REQUEST)            
        attendee_query = Attendee.objects.all()
        if event_id:
            attendee_query = attendee_query.filter(event__id=event_id)

        if not attendee_query.exists():
            return Response({'data':'No attendees for this event','error':True},status=status.HTTP_404_NOT_FOUND)

        if is_paginated:
            return Response({"data":getPagination(attendee_query,request=requset,Serializer=AttendeeSerializer),"error":False},status=status.HTTP_200_OK)
            
        else:
            return Response({'data': AttendeeSerializer(attendee_query,many=True).data, "error":False},status=status.HTTP_200_OK)
