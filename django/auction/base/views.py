from django.shortcuts import render


# display index.html


def front(request):
    context = {}
    return render(request, "index.html", context)
