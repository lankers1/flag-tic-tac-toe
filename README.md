# flag-tic-tac-toe
## Background
This project started out as a means to learn Golang and websockets, a technology I’d never encountered professionally. I am a lover of Geography and gaming, so I combined these two to create Flag tic-tac-toe in an attempt to test my vexillological knowledge.

## Development
As my main focus was on learning about backend I wanted a lightweight frontend codebase, which led to my choice for Zustand over something like React-redux and choosing Sass instead of and alternative like tailwind CSS. Some frontend tooling used:
- Vite (inc. Esbuild) for development and bundling.
- Zustand for state management
- React-query for server state and fetching
- Sass, CSS preprocessor
- React-router

Other tools used throughout development:
- Figma to design the mockups
- Lucidchart for database modeling 
- NeonDB for database hosting
- Google cloud for hosting/deployments

## Considerations
### SSR vs CSR
I explored using Next.js or Remix for SSR capabilities, but ultimately the speed of development and developer experience of Vite persuaded me to go with Vite. The SEO benefits of SSR were negligible as I am currently receiving a score of 100 in lighthouse for SEO.

I also was reluctant to get vendor locked with the Next.js ecosystem, it felt too cumbersome and I wanted to explore alternative host providers to vercel. Similarly, my goal was to implement my API with golang, introducing Next.js would have added unnecessary complexity and an additional backend-for-frontend layer that was unnecessary with my project.

### Relational DB vs Document model (NOSQL)
This was an easy choice, the data model made sense to use a RDBMS like Postgres. This was mainly due to the concept of flag characteristics and the joining that occurs when generating a new game.

### Security
For security, as the site is really just a personal project I implemented a very basic authorization system whereby users would have a unique token and when updating their data the token is required in the request payload. In the future I will look into implementing JWT authentication.


### Architecture
![Architecture](https://github.com/user-attachments/assets/2bd39796-6303-41e3-a580-55b0220cc402)

 
