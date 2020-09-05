# Backend

## env required

### Backend related

PORT  
SECRET_TOKEN_KEY - this is used for encrypting json web tokens

### Database related

DEVELOPMENT_DATABASE_USER  
DEVELOPMENT_HOST_LOCATION  
DEVELOPMENT_DATABASE_NAME  
DEVELOPMENT_DATABASE_PASSWORD  
DEVELOPMENT_DATABASE_PORT

DATABASE_URL - for production

In src/db/setup.sql, running this file will create all relations necessary from scratch

### Cloudinary related

CLOUDINARY_NAME  
CLOUDINARY_API_KEY  
CLOUDINARY_API_SECRET
