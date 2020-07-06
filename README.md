Postman TEST

req url:

POST: localhost/3000/products

In postman -> Body -> raw -> dropdown select JSON

paste:

{
	"productId": "8374837483",
	"quantity": "10"
}


Get decode value of json web token (it's not encrypted, just encoded):
https://jwt.io/


Just renamed user to users - to be more semantically correct...



Add checkAuth middleware to Products POST route

DON'T add auth token to request body as form data (not a typical pattern) i.e.

Key			Value
token		eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...

Order of where checkAuth middleware is in request handler is important...

router.post('/', checkAuth, upload.single('productImage'), async (req, res, next)

If we add token as above to body and send as form data - the form data is parsed after the checkAuth - so token doesn't exist on req
until after it is parsed by upload.single('productImage') - which gets image but also parses the form data. So authentication will fail.
We could fix this by changing the order:

router.post('/', upload.single('productImage'), checkAuth, async (req, res, next)

But this is not recommended pattern...

A typical pattern is to send token as part of header:

Key					Value
Authorization		Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...

Bearer - simply convention to indication the authorization header bears a token

now no longer need to parse the body to get the auth token, we just need to look at the header...

Now can conveniently add auth to any route that should be protected. Using JWT concept for authentication flow.
Client can identify itself to server (and access protected resources) without server having to store any information
about connected clients - True STATELESS authentication implemented in out RESTful service through JWT :)







