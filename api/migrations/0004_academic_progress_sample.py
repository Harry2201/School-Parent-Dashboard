from django.db import migrations
import datetime

def create_academic_progress_data(apps, schema_editor):
    Student = apps.get_model('api', 'Student')
    Subject = apps.get_model('api', 'Subject')
    Assignment = apps.get_model('api', 'Assignment')
    RecentActivity = apps.get_model('api', 'RecentActivity')

    # Get or create a student
    student, _ = Student.objects.get_or_create(name='Emma Johnson', grade='8')

    # Subjects and their progress
    math = Subject.objects.create(name='Mathematics', student=student, grade='A', last_test='92% (Algebra Test)', teacher='Mrs. Smith', progress=88)
    english = Subject.objects.create(name='English Literature', student=student, grade='B+', last_test='85% (Essay)', teacher='Mr. Johnson', progress=82)
    science = Subject.objects.create(name='Science', student=student, grade='A-', last_test='87% (Biology Project)', teacher='Dr. Wilson', progress=86)
    social = Subject.objects.create(name='Social Studies', student=student, grade='B', last_test='80% (Civics Project)', teacher='Ms. Lee', progress=79)

    # Assignments and tests for each subject
    Assignment.objects.create(student=student, title='Algebra Test', due='2025-06-01', status='completed', subject='Mathematics', grade='A', score=92, type='exam')
    Assignment.objects.create(student=student, title='Geometry Assignment', due='2025-06-10', status='completed', subject='Mathematics', grade='B+', score=85, type='assignment')
    Assignment.objects.create(student=student, title='Problem Solving', due='2025-06-15', status='completed', subject='Mathematics', grade='A-', score=90, type='assignment')
    Assignment.objects.create(student=student, title='Essay Writing', due='2025-06-05', status='completed', subject='English Literature', grade='B', score=78, type='assignment')
    Assignment.objects.create(student=student, title='Poetry Analysis', due='2025-06-12', status='completed', subject='English Literature', grade='A-', score=85, type='assignment')
    Assignment.objects.create(student=student, title='Book Review', due='2025-06-18', status='completed', subject='English Literature', grade='B+', score=83, type='assignment')
    Assignment.objects.create(student=student, title='Physics Lab', due='2025-06-03', status='completed', subject='Science', grade='A-', score=88, type='project')
    Assignment.objects.create(student=student, title='Chemistry Test', due='2025-06-09', status='completed', subject='Science', grade='B+', score=84, type='exam')
    Assignment.objects.create(student=student, title='Biology Project', due='2025-06-20', status='completed', subject='Science', grade='A-', score=87, type='project')
    Assignment.objects.create(student=student, title='History Essay', due='2025-06-07', status='completed', subject='Social Studies', grade='B', score=76, type='assignment')
    Assignment.objects.create(student=student, title='Geography Quiz', due='2025-06-14', status='completed', subject='Social Studies', grade='B+', score=82, type='exam')
    Assignment.objects.create(student=student, title='Civics Project', due='2025-06-22', status='completed', subject='Social Studies', grade='B', score=80, type='project')

    # Recent activities
    RecentActivity.objects.create(student=student, title='Mathematics Mid-term Exam', activity_type='exam', date=datetime.date.today() - datetime.timedelta(days=2), score=92)
    RecentActivity.objects.create(student=student, title='English Literature Essay Submitted', activity_type='assignment', date=datetime.date.today() - datetime.timedelta(days=5), score=85)
    RecentActivity.objects.create(student=student, title='Science Project Presentation', activity_type='project', date=datetime.date.today() - datetime.timedelta(days=7), score=88)
    RecentActivity.objects.create(student=student, title='Social Studies Assignment', activity_type='assignment', date=datetime.date.today() - datetime.timedelta(days=7), score=80)

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0003_assignment_score_assignment_type_subject_progress_and_more'),
    ]

    operations = [
        migrations.RunPython(create_academic_progress_data),
    ] 