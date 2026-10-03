from django.db import models
from django.contrib.auth.models import User

choices = [
    ('easy','Easy'),
    ('medium','Medium'),
    ('hard','Hard')
]

class Quiz(models.Model):
    userId = models.ForeignKey(User,on_delete=models.CASCADE)
    subject = models.CharField(max_length=50)
    topic = models.CharField(max_length=100)
    grade = models.CharField(max_length=20)
    level = models.CharField(max_length=10,choices=choices)
    question_count = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)


    def __str__(self):
        return self.topic

class QuizQuestions(models.Model):
    quizId = models.ForeignKey(Quiz,on_delete=models.CASCADE)
    question = models.TextField()
    option1 = models.CharField(max_length=30)
    option2 = models.CharField(max_length=30)
    option3 = models.CharField(max_length=30)
    option4 = models.CharField(max_length=30)
    correct_ans = models.CharField(max_length=30)

    def __str__(self):
        return self.question

class Student(models.Model):
    name = models.CharField(max_length=30)
    grade = models.CharField(max_length=20)
    dob = models.DateField()

    def __str__(self):
        return self.name 

class StudentResult(models.Model):
    quizId = models.ForeignKey(Quiz,on_delete=models.CASCADE)
    stdId = models.ForeignKey(Student,on_delete=models.CASCADE)
    total_question = models.IntegerField()
    correct_answer = models.IntegerField()
    startTime = models.TimeField()
    completeTime = models.TimeField(auto_now_add=True)



class StudentResponse(models.Model):
    responseId = models.ForeignKey(StudentResult,on_delete=models.CASCADE)
    questionId = models.ForeignKey(QuizQuestions,on_delete=models.CASCADE)
    selected_option = models.CharField(max_length=30)
    is_correct = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)




