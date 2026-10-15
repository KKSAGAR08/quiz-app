from django.urls import path
from .views import quiz_details_view,student_details_view,quiz_questions_form_view

urlpatterns = [
    path('quiz/<int:quiz_id>/',quiz_details_view,name="quiz_details"),
    path('quiz/<int:quiz_id>/stddetails/',student_details_view,name='std_details'),
    path('quiz/<int:quiz_id>/quizform/',quiz_questions_form_view,name='quiz_form'),
]
