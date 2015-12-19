import webapp2
import json

from google.appengine.ext import ndb

class Location(ndb.Model):
	formatted_address = ndb.StringProperty()
	country = ndb.StringProperty()
	postal_code = ndb.StringProperty()
	administrative_area_level_1 = ndb.StringProperty()
	administrative_area_level_2 = ndb.StringProperty()
	administrative_area_level_3 = ndb.StringProperty()
	administrative_area_level_4 = ndb.StringProperty()
	administrative_area_level_5 = ndb.StringProperty()
	locality = ndb.StringProperty()
	sublocality_level_1 = ndb.StringProperty()
	sublocality_level_2 = ndb.StringProperty()
	sublocality_level_3 = ndb.StringProperty()
	sublocality_level_4 = ndb.StringProperty()
	sublocality_level_5 = ndb.StringProperty()
	neighborhood = ndb.StringProperty()
	premise = ndb.StringProperty()
	subpremise = ndb.StringProperty()
	lat = ndb.FloatProperty()
	lng = ndb.FloatProperty()

class User(ndb.Model):
	home = ndb.StructuredProperty(Location)
	office = ndb.StructuredProperty(Location)
	mobileOrEmail = ndb.StringProperty()
	car_number_type = ndb.StringProperty()
	shift_start_time = ndb.StringProperty()
	shift_stop_time = ndb.StringProperty()
	join_date = ndb.DateTimeProperty(auto_now_add=True)
	update_date = ndb.DateTimeProperty(auto_now=True)


class NewUser(webapp2.RequestHandler):
	def post(self):
		# self.response.headers['Content-Type'] = 'application/json'
		jsonObj = json.loads(self.request.body)

		# print jsonObj['user']['mobileOrEmail']
		# print jsonObj['user']['carNumberType']
		# print jsonObj['user']['shiftStartTime']
		# print jsonObj['user']['shiftStopTime']
		# addressTypes = ['home', 'office']
		# for addressType in addressTypes:
		# 	print jsonObj['user'][addressType]['formatted_address']
		# 	print jsonObj['user'][addressType]['country']
		# 	print jsonObj['user'][addressType]['postal_code']
		# 	print jsonObj['user'][addressType]['administrative_area_level_1']
		# 	print jsonObj['user'][addressType]['administrative_area_level_2']
		# 	print jsonObj['user'][addressType]['administrative_area_level_3']
		# 	print jsonObj['user'][addressType]['administrative_area_level_4']
		# 	print jsonObj['user'][addressType]['administrative_area_level_5']
		# 	print jsonObj['user'][addressType]['locality']
		# 	print jsonObj['user'][addressType]['sublocality_level_1']
		# 	print jsonObj['user'][addressType]['sublocality_level_2']
		# 	print jsonObj['user'][addressType]['sublocality_level_3']
		# 	print jsonObj['user'][addressType]['sublocality_level_4']
		# 	print jsonObj['user'][addressType]['sublocality_level_5']
		# 	print jsonObj['user'][addressType]['neighborhood']
		# 	print jsonObj['user'][addressType]['premise']
		# 	print jsonObj['user'][addressType]['subpremise']
		# 	print jsonObj['user'][addressType]['lat']
		# 	print jsonObj['user'][addressType]['lng']

		user = User()
		user.mobileOrEmail = jsonObj['user']['mobileOrEmail']
		user.car_number_type = jsonObj['user']['carNumberType']
		user.shift_start_time = jsonObj['user']['shiftStartTime']
		user.shift_stop_time = jsonObj['user']['shiftStopTime']

		user.home = Location()
		user.home.formatted_address = jsonObj['user']['home']['formatted_address']
		user.home.country = jsonObj['user']['home']['country']
		user.home.postal_code = jsonObj['user']['home']['postal_code']
		user.home.administrative_area_level_1 = jsonObj['user']['home']['administrative_area_level_1']
		user.home.administrative_area_level_2 = jsonObj['user']['home']['administrative_area_level_2']
		user.home.administrative_area_level_3 = jsonObj['user']['home']['administrative_area_level_3']
		user.home.administrative_area_level_4 = jsonObj['user']['home']['administrative_area_level_4']
		user.home.administrative_area_level_5 = jsonObj['user']['home']['administrative_area_level_5']
		user.home.locality = jsonObj['user']['home']['locality']
		user.home.sublocality_level_1 = jsonObj['user']['home']['sublocality_level_1']
		user.home.sublocality_level_2 = jsonObj['user']['home']['sublocality_level_2']
		user.home.sublocality_level_3 = jsonObj['user']['home']['sublocality_level_3']
		user.home.sublocality_level_4 = jsonObj['user']['home']['sublocality_level_4']
		user.home.sublocality_level_5 = jsonObj['user']['home']['sublocality_level_5']
		user.home.neighborhood = jsonObj['user']['home']['neighborhood']
		user.home.premise = jsonObj['user']['home']['premise']
		user.home.subpremise = jsonObj['user']['home']['subpremise']
		user.home.lat = jsonObj['user']['home']['lat']
		user.home.lng = jsonObj['user']['home']['lng']

		user.office = Location()
		user.office.formatted_address = jsonObj['user']['office']['formatted_address']
		user.office.country = jsonObj['user']['office']['country']
		user.office.postal_code = jsonObj['user']['office']['postal_code']
		user.office.administrative_area_level_1 = jsonObj['user']['office']['administrative_area_level_1']
		user.office.administrative_area_level_2 = jsonObj['user']['office']['administrative_area_level_2']
		user.office.administrative_area_level_3 = jsonObj['user']['office']['administrative_area_level_3']
		user.office.administrative_area_level_4 = jsonObj['user']['office']['administrative_area_level_4']
		user.office.administrative_area_level_5 = jsonObj['user']['office']['administrative_area_level_5']
		user.office.locality = jsonObj['user']['office']['locality']
		user.office.sublocality_level_1 = jsonObj['user']['office']['sublocality_level_1']
		user.office.sublocality_level_2 = jsonObj['user']['office']['sublocality_level_2']
		user.office.sublocality_level_3 = jsonObj['user']['office']['sublocality_level_3']
		user.office.sublocality_level_4 = jsonObj['user']['office']['sublocality_level_4']
		user.office.sublocality_level_5 = jsonObj['user']['office']['sublocality_level_5']
		user.office.neighborhood = jsonObj['user']['office']['neighborhood']
		user.office.premise = jsonObj['user']['office']['premise']
		user.office.subpremise = jsonObj['user']['office']['subpremise']
		user.office.lat = jsonObj['user']['office']['lat']
		user.office.lng = jsonObj['user']['office']['lng']

		user_key = user.put()

		self.response.write(user_key)

app = webapp2.WSGIApplication([
	('/api', NewUser)
], debug = True)