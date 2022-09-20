from django.shortcuts import render


# display index.html


def front(request):
    context = {}
    return render(request, "index.html", context)


def items(request, id):
    context = {}
    return render(request, "index.html", context)


def users(request, username):
    context = {}
    return render(request, "index.html", context)
