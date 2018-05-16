from rest_framework.test import APIClient, APITestCase

from pugorugh.models import User, Dog, UserDog, UserPref


class UserTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_user_create(self):
        data = {'username': 'test',
                'password': 'password',
                'password2': 'password'}
        r = self.client.post('/api/user/', data, format='json')
        self.assertEqual(r.status_code, 201)

    def test_user_login(self):
        data = {'username': 'test', 'password': 'password'}
        User.objects.create_user(**data)
        r = self.client.post('/api/user/login/', data, format='json')
        self.assertEqual(r.status_code, 200)
        self.assertTrue(self.client.login(**data))


class UserPrefTestCase(APITestCase):
    def setUp(self):
        data = {'username': 'test', 'password': 'password'}
        self.user = User.objects.create_user(**data)
        self.token = self.client.post(
            '/api/user/login/',
            data,
            format='json').json()['token']
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')

    def test_userpref_create(self):
        self.assertTrue(UserPref.objects.get(user=self.user))

    def test_userpref_retrieve(self):
        r = self.client.get('/api/user/preferences/')
        self.assertEqual(r.status_code, 200)

    def test_userpref_update(self):
        data = {'user': self.user, 'age': 'b', 'gender': 'm', 'size': 's'}
        r = self.client.put('/api/user/preferences/', data=data)
        self.assertEqual(r.status_code, 200)


class DogTestCase(APITestCase):
    def test_dog_all_ages(self):
        self.dog1 = Dog.objects.create(
            name='Hachiko',
            image_filename='hachiko.jpg',
            breed='Pitbull',
            age=1,
            gender='f',
            size='l')
        self.dog2 = Dog.objects.create(
            name='Hachiko',
            image_filename='hachiko.jpg',
            breed='Pitbull',
            age=26,
            gender='f',
            size='l')
        self.dog3 = Dog.objects.create(
            name='Hachiko',
            image_filename='hachiko.jpg',
            breed='Pitbull',
            age=51,
            gender='f',
            size='l')
        self.dog4 = Dog.objects.create(
            name='Hachiko',
            image_filename='hachiko.jpg',
            breed='Pitbull',
            age=76,
            gender='f',
            size='l')


class UserDogTestCase(APITestCase):
    def setUp(self):
        data = {'username': 'test', 'password': 'password'}
        self.user = User.objects.create_user(**data)
        self.token = self.client.post(
            '/api/user/login/',
            data,
            format='json').json()['token']
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')

        self.userpref = UserPref.objects.filter(user=self.user)
        self.userpref.update(age='b,y,a,s', gender='m,f', size='s,m,l,xl')

        self.dog = Dog.objects.create(
            name='Hachiko',
            image_filename='hachiko.jpg',
            breed='Pitbull',
            age=36,
            gender='f',
            size='l')

    def test_userdog_create(self):
        r = self.client.get('/api/dog/-1/undecided/next/')
        self.assertEqual(r.status_code, 200)
        userdog_count = UserDog.objects.filter(user=self.user).count()
        self.assertGreater(userdog_count, 0)

    def test_userdog_next_not_found(self):
        self.client.get('/api/dog/-1/undecided/next/')
        r = self.client.get('/api/dog/1/undecided/next/')
        self.assertEqual(r.status_code, 200)

    def test_userdog_update(self):
        self.client.get('/api/dog/-1/undecided/next/')
        r = self.client.put('/api/dog/1/liked/')
        self.assertEqual(r.status_code, 200)

    def test_userdog_none_found(self):
        r = self.client.get('/api/dog/1/undecided/next/')
        self.assertEqual(r.status_code, 404)
