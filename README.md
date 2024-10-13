<div align="center">
 
# ArtSphere ![GitHub deployments](https://img.shields.io/github/deployments/deepsingh132/artsphere/production?label=build) [![Docker Image CI](https://github.com/deepsingh132/Artsphere/actions/workflows/docker-image.yml/badge.svg)](https://github.com/deepsingh132/Artsphere/actions/workflows/docker-image.yml) [![Node.js CI](https://github.com/deepsingh132/Artsphere/actions/workflows/node.js.yml/badge.svg)](https://github.com/deepsingh132/Artsphere/actions/workflows/node.js.yml)

</div>

Welcome to ArtSphere 🖼️, a vibrant and innovative social media web app dedicated to the artistic souls of the world. Just like a painter's canvas, the platform provides a blank space for actors, musicians, writers, and visual artists to express themselves and connect with a global community that shares their passion for art and culture, developed with Next.js 13 🔼 and tailwind 🌬️.

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Project Overview](#project-overview)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🌟 [Features](#features)
4. 📸 [Screenshots](#screenshots)
5. 🚀 [Getting Started](#getting-started)
6. 🐳 [Docker Instructions](#docker)
7. 🤝 [Contributing](#contributing)
8. 📄 [License](#license)
9. 📧 [Contact](#contact)

## <a name="project-overview">🤖 Project Overview</a>

ArtSphere aims to bridge gaps in art and culture, creating an inclusive virtual sphere where creativity knows no bounds. It's more than just a Twitter replica; it's a creative hub where you can showcase your talents, collaborate with like-minded artists, and explore the endless possibilities of artistic expression.

## <a name="tech-stack">⚙️ Tech Stack</a>

ArtSphere is built with cutting-edge technologies to provide a seamless and engaging user experience:

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL (Supabase)
- Drizzle-ORM
- NextAuth
- JsonWebToken (JWT)
- Recoil
- SWR (Data Fetching)

## <a name="features">🌟 Features</a>

ArtSphere offers a plethora of features designed to inspire and empower artists:

- Profile Showcase: Create a profile that reflects your artistic identity with images, bios, and links to your works.

- Posts and Updates: Share your thoughts, artwork, or performances with the world through text, images, and videos.

- Connect and Collaborate: Connect with fellow artists, follow their journeys, and collaborate on artistic projects.

- Hashtags and Trends: Discover the latest trends and explore a universe of hashtags to find art that resonates with you.

- Notifications: Stay updated with real-time notifications on new followers, likes, and comments on your posts.

- Private Messaging: Engage in one-on-one conversations with your creative peers.

- Verified Profiles: Stand out as a verified artist, enhancing your credibility within the community.

- Dark Mode: Choose the theme that suits your mood and enhances your creativity.

- Explore Art: Dive into a gallery of artistic posts, from poetry and music to paintings and dance.

<br>

## <a name="screenshots">📸 Screenshots</a>

<br>

<table>
  <thead>
    <tr>
      <th>Desktop</th>
      <th>Mobile/Responsive</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img
          src="./screenshots/home.png" alt="desktop-home"
          height="200"
        />
      </td>
      <td>
        <img
          src="./screenshots/mobile/home.png"
          alt="mobile-home"
          width="200"
        />
      </td>
    </tr>
    <tr>
      <td align="center">
        <img
          src="./screenshots/events.png"
          alt="events"
          height="200"
        />
      </td>
      <td>
        <img
          src="./screenshots/mobile/events.png"
          alt="mobile-events"
          width="200"
        />
      </td>
    </tr>
    <tr>
      <td align="center">
        <img
          src="./screenshots/event-detail.png"
          alt="desktop-search1"
          height="400"
        />
      </td>
      <td>
        <img
          src="./screenshots/mobile/event-detail.png"
          alt="mobile-search"
          width="200"
        />
      </td>
    </tr>
    <tr>
      <td align="center">
        <img
          src="./screenshots/singlepost.png"
          alt="desktop-search1"
          width="400"
        />
      </td>
      <td>
        <img
          src="./screenshots/mobile/singlepost.png"
          width="200"
        />
      </td>
    </tr>
    <tr>
      <td align="center">
        <img
          src="./screenshots/commentmodal.png"
          height="200"
        />
      </td>
      <td>
        <img
          src="./screenshots/mobile/commentmodal.png"
          width="200"
        />
      </td>
    </tr>
    <tr>
      <td align="center">
        <img
          src="./screenshots/notifications.png"
          height="200"
        />
      </td>
      <td>
        <img
          src="./screenshots/mobile/settings-mobile.png"
          width="200"
        />
      </td>
    </tr>
    <tr>
      <td align="center">
        <img
          src="./screenshots/home-dark.png"
          height="200"
          width="400"
        />
      </td>
      <td>
        <img
          src="./screenshots/mobile/navbar.png"
          width="200"
        />
      </td>
    </tr>
  </tbody>
</table>


## <a name="getting-started">🚀 Getting Started</a>

First, install all the required packages by running:
```bash
npm install
# or
yarn install
```

then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## <a name="docker">🐳 Docker Instructions</a>

You can run this project using Docker with the latest image from Docker Hub. Make sure you have Docker installed and running on your machine.
Follow these steps:

1. Pull the latest image from Docker Hub.

    ```bash
    docker pull deepsingh132/artsphere:latest
    ```

2. Run the Docker image with the following command:

    ```bash
    docker run --env-file .PATHTOYOURENVFILE -p 3000:3000 deepsingh132/artsphere:latest
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api](http://localhost:3000/api). These endpoints can be edited in `app/api`.

The `app/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## <a name="contributing">🤝 Contributing</a>

We welcome contributors who want to make ArtSphere an even better platform for artists. Feel free to fork the repository and submit pull requests to enhance the app.

## <a name="license">📄 License</a>

ArtSphere is licensed under the MIT License. You are free to use and modify the code, so long as you include the appropriate attribution.

## <a name="contact">📧 Contact</a>

If you have any questions or suggestions regarding the project, please feel free to reach out to me at [mandeeparora132@gmail.com](mailto:email@example.com).

Join ArtSphere, the canvas of endless creativity, and unleash the artist within you!
