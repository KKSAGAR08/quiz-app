from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from .models import Quiz,QuizQuestions,Student,StudentResult,StudentResponse
import os
from .config.service import get_questions_on_prompt
import json
from pprint import pprint
from datetime import datetime

def login_view(request):

    if request.user.is_authenticated:
        return redirect('dashboard')

    context = dict()

    if request.method == 'POST':
        email = request.POST.get('email')
        pwd = request.POST.get('pwd')

        try:
            user = User.objects.get(email=email)
            user = authenticate(request,username=user.username, password=pwd)

            if user is not None:
                login(request,user)
                return redirect('dashboard')
            else:
                context['message'] = "Invalid Credentials"

        except (User.DoesNotExist,User.MultipleObjectsReturned):
            context['message'] = "Invalid Credentials"    

    return render(request,'authentication/login.html',context=context)



def register_view(request):

    if request.user.is_authenticated:
        return redirect('dashboard')

    context = dict()

    if request.method == "POST":

        username = request.POST.get('name')
        email = request.POST.get('email')
        pwd = request.POST.get('pwd')
        cnfpwd = request.POST.get('cnfpwd')


        if pwd == cnfpwd:
            if User.objects.filter(email=email).exists():
                context['message'] = 'Email already present'
            else:
                User.objects.create_user(username=username,email=email,password=pwd)
                return redirect('dashboard')
        else:
            context['message'] = 'Password do not matching'


    return render(request,'authentication/register.html',context=context)


@login_required(login_url='login')
def dashboard_view(request):

    context = dict()
    user = request.user

    quiz_list = user.quiz_set.all()

    if quiz_list:
        context['quiz_list'] = quiz_list
    else:
        context['message'] = 'No quizzes yet'


    return render(request,'dashboard.html',context=context)

@login_required(login_url='login')
def get_quiz_details_view(request,quiz_id):

    try:
        quiz_details = Quiz.objects.get(id=quiz_id,userId=request.user)
    except Quiz.DoesNotExist:
        return HttpResponse("Quiz with this id did not found")

    student_result = StudentResult.objects.filter(quizId=quiz_details)

    sorted_student_result = list()

    for std in student_result:
        sorted_student_result.append({
            'std_name':std.stdId.name,
            'time_taken': datetime.combine(datetime.min, std.completeTime) - datetime.combine(datetime.min, std.startTime), 
            'score':(std.correct_answer/std.total_question)*100
        })

    sorted_student_result.sort( key=lambda x: (-x['score'], x['time_taken']) )

    print(sorted_student_result)
    
    context = {
        'quiz_details':quiz_details,
        'student_details':sorted_student_result
    }
    return render(request,'quiz_leaderboard.html',context=context)


@login_required(login_url='login')
def logout_view(request):
    logout(request)
    return redirect('login')


@login_required(login_url='login')
def generate_quiz_view(request):

    print(request.user.id)

    if request.method == "POST":
        subject = request.POST.get('subject')
        grade = request.POST.get('grade')
        topic = request.POST.get('topic')
        questions_count = request.POST.get('questions')
        difficulty = request.POST.get('diff')

        questions = get_questions_on_prompt(questions_count,subject,grade,difficulty,topic)

        questions = json.loads(questions)

        context = {
            "subject":questions['subject'],
            "grade":questions['grade'],
            "topic":questions['topic'],
            "difficulty":questions['difficulty'],
            "questions_list":questions['questions'],
        }

        request.session['quiz_details'] = context

        return render(request,'generated_quiz_questions.html',context=context)
    
    return render(request,'generate_quiz.html')

@login_required(login_url='login')
def generated_question_view(request):

    if request.method == 'POST':
        quiz_details = request.session.get('quiz_details',[])
        print(quiz_details)

        subject = quiz_details['subject']
        grade = quiz_details['grade']
        topic = quiz_details['topic']
        difficulty = quiz_details['difficulty']
        questions_list = quiz_details['questions_list']

        quiz = Quiz.objects.create(userId=request.user,subject=subject,topic=topic,grade=grade,level=difficulty,question_count=len(questions_list))

        for q in questions_list:
            questions = QuizQuestions(quizId=quiz,question=q['question'],option1=q['options'][0],option2=q['options'][1],option3=q['options'][2],option4=q['options'][3],correct_ans=q['answer'])
            questions.save()

        return redirect('generate_quiz')
        
    return redirect('generate_quiz')


@login_required(login_url='login')
def deactive_quiz_view(request,quiz_id):
    try:
        quiz_details = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return HttpResponse("Invalid Action")

    quiz_details.is_active = not quiz_details.is_active
    quiz_details.save()

    return redirect('dashboard')

    