import webapp2
import json

class MainPage(webapp2.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'application/json'
		jsonObj = {
			'name': 'value'
		}
		self.response.write(json.dumps(jsonObj))

class NewUser(webapp2.RequestHandler):
	def post(self):
		self.response.headers['Content-Type'] = 'application/json'
		jsonObj = json.loads(self.request.body)
		print jsonObj['user']['carNumberType']
		self.response.write(json.dumps(jsonObj))

app = webapp2.WSGIApplication([
#	('/api', MainPage),
	('/api', NewUser)
], debug = True)