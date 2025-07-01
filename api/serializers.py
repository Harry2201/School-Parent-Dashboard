from rest_framework import serializers
from .models import Student, Subject, Assignment, Attendance, RecentActivity

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'grade', 'last_test', 'teacher', 'progress']

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'title', 'due', 'status', 'subject', 'grade', 'score', 'type']

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'

class RecentActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = RecentActivity
        fields = ['id', 'title', 'activity_type', 'date', 'score']

class StudentSerializer(serializers.ModelSerializer):
    subjects = SubjectSerializer(many=True, read_only=True)
    assignments = AssignmentSerializer(many=True, read_only=True)
    attendances = AttendanceSerializer(many=True, read_only=True)
    activities = RecentActivitySerializer(many=True, read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'name', 'grade', 'subjects', 'assignments', 'attendances', 'activities'] 