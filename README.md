# Nepal eMart

This is a NextJS starter project for Nepal eMart.

To get started, take a look at `src/app/page.tsx`.

## Running the Project Locally

1.  Install the dependencies:
    ```bash
    npm install
    ```
2.  Run the development server:
    ```bash
    npm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Seeding the Database

The project uses a local JSON file as a mock database. To populate it with initial product data, run the seed script:

```bash
npm run seed
```

## Deployment to Firebase

This project is configured to be deployed with **Firebase App Hosting**. You can deploy your site for free by following these steps.

1.  **Install the Firebase CLI**
    If you don't have it installed already, run this command in your terminal:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Log in to Firebase**
    Log in to your Google account that is associated with Firebase:
    ```bash
    firebase login
    ```

3.  **Initialize Firebase in Your Project**
    If you haven't already connected this local project to Firebase, run the following command in your project's root directory:
    ```bash
    firebase init
    ```
    When prompted, choose the following options:
    -   Select **"App Hosting: Configure and deploy Firebase App Hosting sites"**.
    -   Select the Firebase project you want to deploy to.
    -   Follow the remaining prompts, accepting the defaults.

4.  **Deploy Your Application**
    After initialization, you can deploy your application with a single command:
    ```bash
    firebase deploy
    ```

After the command finishes, the CLI will give you the URL where your live application is hosted. That's it! Your site is now live on the web.