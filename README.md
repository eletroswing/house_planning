House Planning

Transform house floor plans into augmented reality using artificial intelligence.
> Uses in-memory database

Install npm dependencies and then configure an .env based on .env.example

The URL tag must be your computer on the local network, that is, within your internet network (something like 192.168.1.103)

To get the RAPID_API envs, go to: https://rapidapi.com/akashdev2016/api/floor-plan-digitalization/playground/apiendpoint_5e81d630-1eeb-4c78-8cc2-aa93b48768e6

Use npm run dev or npm run start to start.

The application will provide a url /upload, in it, send a post with the body form data passing a file with name image, and value being the image of the floor plan of the house
After some processing time, the app will return a URL for you to access. 
When opening this url on any device on your local network, it will be possible to see the 3D generated (in the case of computers), and on mobile devices, it will be possible to see the environment in augmented reality (even in full size)