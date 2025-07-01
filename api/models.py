from django.db import models

# Create your models here.

class Student(models.Model):
    name = models.CharField(max_length=100)
    grade = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.name} - Grade {self.grade}"

class Subject(models.Model):
    name = models.CharField(max_length=100)
    student = models.ForeignKey(Student, related_name='subjects', on_delete=models.CASCADE)
    grade = models.CharField(max_length=5)
    last_test = models.CharField(max_length=100)
    teacher = models.CharField(max_length=100)
    progress = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} ({self.student.name})"

class Assignment(models.Model):
    student = models.ForeignKey(Student, related_name='assignments', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    due = models.CharField(max_length=50)
    status = models.CharField(max_length=20)
    subject = models.CharField(max_length=100)
    grade = models.CharField(max_length=5, blank=True, null=True)
    score = models.IntegerField(blank=True, null=True)  # percent or points
    type = models.CharField(max_length=20, default='assignment')  # assignment, exam, project

    def __str__(self):
        return f"{self.title} ({self.student.name})"

class Attendance(models.Model):
    student = models.ForeignKey(Student, related_name='attendances', on_delete=models.CASCADE)
    date = models.DateField()
    present = models.BooleanField()

    def __str__(self):
        return f"{self.student.name} - {self.date} - {'Present' if self.present else 'Absent'}"

class RecentActivity(models.Model):
    student = models.ForeignKey(Student, related_name='activities', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    activity_type = models.CharField(max_length=20)  # exam, assignment, project
    date = models.DateField()
    score = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} ({self.student.name})"
