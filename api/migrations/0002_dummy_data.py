from django.db import migrations, models
import datetime

def create_dummy_data(apps, schema_editor):
    Student = apps.get_model('api', 'Student')
    Subject = apps.get_model('api', 'Subject')
    Assignment = apps.get_model('api', 'Assignment')
    Attendance = apps.get_model('api', 'Attendance')

    # Create students
    emma = Student.objects.create(name='Emma Johnson', grade='8')
    alex = Student.objects.create(name='Alex Johnson', grade='5')

    # Subjects for Emma
    Subject.objects.create(name='Mathematics', student=emma, grade='A', last_test='92% (Algebra Quiz)', teacher='Mrs. Smith')
    Subject.objects.create(name='English Literature', student=emma, grade='B+', last_test='88% (Essay on Shakespeare)', teacher='Mr. Johnson')
    Subject.objects.create(name='Science', student=emma, grade='A-', last_test='94% (Chemistry Experiment)', teacher='Dr. Wilson')

    # Assignments for Emma
    Assignment.objects.create(student=emma, title='Math Homework - Chapter 5', due='Tomorrow', status='pending', subject='Mathematics')
    Assignment.objects.create(student=emma, title='Science Project - Solar System', due='Next Friday', status='pending', subject='Science')
    Assignment.objects.create(student=emma, title='English Essay - My Summer', due='Last Week', status='completed', subject='English', grade='A-')

    # Attendance for Emma
    Attendance.objects.create(student=emma, date=datetime.date.today(), present=True)
    Attendance.objects.create(student=emma, date=datetime.date.today() - datetime.timedelta(days=1), present=True)
    Attendance.objects.create(student=emma, date=datetime.date.today() - datetime.timedelta(days=2), present=False)

    # Subjects for Alex
    Subject.objects.create(name='Elementary Math', student=alex, grade='B+', last_test='84% (Addition/Subtraction)', teacher='Ms. Davis')
    Subject.objects.create(name='Reading', student=alex, grade='A', last_test='95% (Reading Comprehension)', teacher='Mrs. Brown')
    Subject.objects.create(name='Social Studies', student=alex, grade='B', last_test='80% (Geography Quiz)', teacher='Mr. Lee')

    # Assignments for Alex
    Assignment.objects.create(student=alex, title='Reading Log - Week 3', due='Friday', status='pending', subject='Reading')
    Assignment.objects.create(student=alex, title='Math Worksheet - Multiplication', due='Yesterday', status='overdue', subject='Mathematics')
    Assignment.objects.create(student=alex, title='Art Project - My Family', due='Last Week', status='completed', subject='Art', grade='A')

    # Attendance for Alex
    Attendance.objects.create(student=alex, date=datetime.date.today(), present=True)
    Attendance.objects.create(student=alex, date=datetime.date.today() - datetime.timedelta(days=1), present=True)
    Attendance.objects.create(student=alex, date=datetime.date.today() - datetime.timedelta(days=2), present=True)

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_dummy_data),
    ] 