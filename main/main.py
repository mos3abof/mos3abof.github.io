import sys
if not ('lib.zip' in sys.path):
    sys.path.insert(0, 'lib.zip')



import flask
from flaskext import wtf
import config

app = flask.Flask(__name__)
app.config.from_object(config)

from google.appengine.api import mail

import auth
#import util
import model
#import admin


@app.route('/')
def welcome():
    return flask.render_template(
	  'welcome.html',
	  html_class='welcome',
	  channel_name='welcome',
	)

@app.route('/code')
def code():
    return flask.render_template(
	  'code.html',
	  title='Code',
	  html_class='code',
	  channel_name='code',
	)


################################################################################
# Feedback
################################################################################
class FeedbackForm(wtf.Form):
    subject = wtf.TextField('Subject', [wtf.validators.required()])
    feedback = wtf.TextAreaField('Feedback', [wtf.validators.required()])
    email = wtf.TextField('Email (optional)', [
	  wtf.validators.optional(),
	  wtf.validators.email("That doesn't look like an email"),
	])


@app.route('/feedback/', methods=['GET', 'POST'])
def feedback():
    form = FeedbackForm()
    if form.validate_on_submit():
        mail.send_mail(
    		sender=model.Config.get_master_db().feedback_email,
    		to=model.Config.get_master_db().feedback_email,
    		subject='[%s] %s' % (
			model.Config.get_master_db().brand_name,
			form.subject.data,
		  ),
		reply_to=form.email.data or model.Config.get_master_db().feedback_email,
		body='%s\n\n%s' % (form.feedback.data, form.email.data)
	  )
    flask.flash('Thank you for your feedback!', category='success')
    return flask.redirect(flask.url_for('welcome'))
    if not form.errors and auth.current_user_id() > 0:
        form.email.data = auth.current_user_db().email

    return flask.render_template(
	  'feedback.html',
	  title='Feedback',
	  html_class='feedback',
	  form=form,
	)



################################################################################
# Extras
################################################################################
@app.route('/_s/extras/', endpoint='extras_service')
@app.route('/extras/', endpoint='extras')
def extras():
    country = None
    region = None
    city = None
    city_lat_long = None
    if 'X-AppEngine-Country' in flask.request.headers:
        country = flask.request.headers['X-AppEngine-Country']
    if 'X-AppEngine-Region' in flask.request.headers:
        region = flask.request.headers['X-AppEngine-Region']
    if 'X-AppEngine-City' in flask.request.headers:
        city = flask.request.headers['X-AppEngine-City']
    if 'X-AppEngine-CityLatLong' in flask.request.headers:
        city_lat_long = flask.request.headers['X-AppEngine-CityLatLong']

    extra_info = {
    'country': country,
    'region': region,
    'city': city,
    'city_lat_long': city_lat_long,
    'user_agent': flask.request.headers['User-Agent'],
    }

    if flask.request.path.startswith('/_s/'):
        return flask.jsonify(extra_info)

    return flask.render_template(
      'extras.html',
      html_class='extras',
      title='Extras',
      extra_info=extra_info,
    )


@app.route('/chat/')
def chat():
    return flask.render_template(
	  'chat.html',
	  title='Chat',
	  html_class='chat',
	  channel_name='chat',
	)

@app.route('/pinterest-ba754.html')
def pinterest():
    return flask.render_template(
        'pinterest.html',
        title='pinterest',
        html_class='pinterest',
    )

################################################################################
# Error Handling
################################################################################
@app.errorhandler(400)
@app.errorhandler(401)
@app.errorhandler(403)
@app.errorhandler(404)
@app.errorhandler(410)
@app.errorhandler(418)
@app.errorhandler(500)
def error_handler(e):
    try:
        e.code
    except:
        class e(object):
            code = 500
            name = 'Internal Server Error'

    if flask.request.path.startswith('/_s/'):
        return flask.jsonify({
    		'status': 'error',
    		'error_code': e.code,
    		'error_name': e.name.lower().replace(' ', '_'),
    		'error_message': e.name,
    	  })

    return flask.render_template(
	  'error.html',
	  title='%s!!1' % (e.name),
	  html_class='error-page',
	  error=e,
	), e.code
