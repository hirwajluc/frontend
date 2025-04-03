# Use an official nginx image as a base
FROM nginx:alpine

# Copy the built static files to the Nginx HTML directory
COPY ./.output/public /usr/share/nginx/html
COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration file if needed (optional)
# COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
