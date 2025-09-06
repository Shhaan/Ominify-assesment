from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


def getPagination(queryset,Serializer,request,page_size=10,context=None):
    paginator = CustomPagination()
    paginator.page_size=page_size

    result_page = paginator.paginate_queryset(queryset,request)
    if context:
        serailizer_data = Serializer(result_page,many=True,context=context).data

    else:
        serailizer_data = Serializer(result_page,many=True).data
    result_data = {
        "count" : paginator.page.paginator.count,
        'next': paginator.get_next_link(),  # Add next link to the response
        'previous': paginator.get_previous_link(),  # Add previous link to the response
        "results" : serailizer_data
    }
    return result_data