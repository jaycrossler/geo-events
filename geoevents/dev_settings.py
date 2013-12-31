EMAIL_FROM_EMAIL = 'noreply@app02.ozone.nga.mil'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'mailnce.nga.mil'

HOMEPAGE_URL = 'http://www.nga.mil'
REQUEST_ACCOUNT_URL = 'http://www.nga.mil'
COMPRESS_ENABLED = False
NEW_ACCOUNT_2_NAME = 'Geoint Online Account'
NEW_ACCOUNT_2_URL = 'http://geoint-onlint.nga.mil'
SSO_URL = 'https://sso.nga.mil/opensso'
FEEDBACK_NAME = 'Press Page'
FEEDBACK_URL = 'http://ww.yourserver.com/contact'
FEEDBACK_EMAIL_TO = ['IWG-R3LandingPageTest@nga.mil']
EMAIL_NEW_EVENT_TO = ['jay.a.crossler.ctr@nga.mil', 'hadr@nga.mil']
PRODUCT_FEED_FORMAT = "https://app02.ozone.nga.mil/events/proxies/smts_list_format.jsp?name={0}&tags={1}"
BRANDING_LOGO_URL = '/static/geoevents-test/images/nga_logo_40.png'
SITE_TITLE = "National Geospatial-Intelligence Agency - Geo Events"


ADMINS = (
    ('Jay Crossler', 'jay.crossler@gmail.com'),
    ('Jay Crossler', 'jay.a.crossler.ctr@nga.mil'),
)