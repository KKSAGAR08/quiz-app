from django.shortcuts import render
from django.http import HttpResponse
from quiz_app.models import Quiz,QuizQuestions,StudentResult,StudentResponse,Student
from datetime import datetime

def quiz_details_view(request,quiz_id):
    try:
        quiz_details = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return HttpResponse("Quiz Does not Exists")

    if not quiz_details.is_active:
        return render(request,'inactive_quiz.html')

    context = {
        'quiz_details':quiz_details
    }
   
    if request.method == "POST":
        context = {
            'quiz_id':quiz_id
        }
        return render(request,'student_details.html',context=context)

    return render(request,'quiz_details.html',context=context)

def student_details_view(request,quiz_id):

    if request.method == "POST":
        student_details = {
            'name':request.POST.get('name'),
            'grade':request.POST.get('grade'),
            'dob':request.POST.get('dob'),
        }  


        request.session['student_details'] = student_details
        start_time = datetime.now().time()
        request.session['quiz_start_time'] = start_time.isoformat()
    
        quiz_details = Quiz.objects.get(id=quiz_id)
        print(quiz_details)

        if student_details['grade'] != quiz_details.grade:

            context = {
                'error':'Grade not matching with Quiz',
                'quiz_id':quiz_id
            }

            return render(request,'student_details.html',context=context)

        quiz_questions = QuizQuestions.objects.filter(quizId_id=quiz_details)

        context = {
            'quiz_details':quiz_details,
            'quiz_questions':quiz_questions
        }
        
        return render(request,'quiz_form.html',context=context)
    
    return HttpResponse("No Content")

def quiz_questions_form_view(request,quiz_id):

    if request.method == 'POST':
        quiz_details = Quiz.objects.get(id=quiz_id)
        quiz_questions = QuizQuestions.objects.filter(quizId=quiz_details)

        count = 0

        student, created = Student.objects.get_or_create(**request.session['student_details'])

        student_result = StudentResult.objects.filter(quizId=quiz_details,stdId=student)

        if student_result.exists():
            context = {
                'error':'Your Have Already Taken the Test'
            }

            return render(request,'thank_you.html',context=context)

        student_result = StudentResult.objects.create(quizId=quiz_details,stdId=student,total_question=quiz_details.question_count,correct_answer=0,startTime=request.session.get('quiz_start_time'),completeTime=datetime.now().time())

        for quiz in quiz_questions:
            if quiz.correct_ans == request.POST.get(quiz.question):
                count+=1
                StudentResponse.objects.create(responseId=student_result,questionId=quiz,selected_option=request.POST.get(quiz.question),is_correct=True)
            else:
                StudentResponse.objects.create(responseId=student_result,questionId=quiz,selected_option=request.POST.get(quiz.question),is_correct=False)

        student_result.correct_answer = count
        student_result.save()

        request.session.pop('student_details', None)
        request.session.pop('quiz_start_time', None)

        return render(request,'thank_you.html')

    return HttpResponse("No Content")