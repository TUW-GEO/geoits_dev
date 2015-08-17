from django.test import TestCase

from django.contrib.auth import get_user_model
from . import models

# Create your tests here.

class TestProfileModel(TestCase):

    def test_profile_creation(self):
        User = get_user_model()
        #New user created
        user = User.objects.create(
            username="geoits", password="geoits")
        # Check that a Profile instance has been crated
        self.assertIsInstance(user.profile, models.Profile)
        # Call the save method of the user to activate the signal
        # again, and check that it doesn't try to create another
        # profile instace
        user.save()
        self.assertIsInstance(user.profile, models.Profile)