from django.urls import path
from . import views

urlpatterns = [
    path('login/',views.login_view,name='login'),
    path('register/',views.register_view,name='register'),
    path('dashboard/',views.dashboard_view,name='dashboard'),
    path('dashboard/quiz/<int:quiz_id>',views.get_quiz_details_view,name='quiz_leaderboard'),
    path('logout/',views.logout_view,name='logout'),
    path('generate_quiz/',views.generate_quiz_view,name='generate_quiz'),
    path('generated_questions/',views.generated_question_view,name="generated_quiz"),
    path('dashboard/quiz/<int:quiz_id>/changestatus',views.deactive_quiz_view,name='change_quiz_status')
]
