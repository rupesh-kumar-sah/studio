# Nepal eMart

This is a Next.js starter project for Nepal eMart, an e-commerce platform built with modern web technologies.

To get started, take a look at `src/app/page.tsx`.

## Running the Project Locally

Before you begin, ensure you have Node.js version 18.x or newer (but less than 21) installed.

1.  **Install Dependencies**
    Run the following command to install all the necessary packages for the project.
    ```bash
    npm install
    ```

2.  **Set Up Environment Variables**
    Create a file named `.env.local` in the root of your project and copy the contents of `.env.example`. Fill in the values with your actual Firebase project credentials.
    ```bash
    cp .env.example .env.local
    ```

3.  **Run the Development Server**
    Start the local development server with this command:
    ```bash
    npm run dev
    ```

4.  **View Your Application**
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Seeding the Database

The project uses a local JSON file that acts as a mock database for products. To populate your local data, you can use the seed script (though the app primarily reads from `src/lib/products.json` directly).

```bash
npm run seed
```
This command is configured to write to Firestore, but our current implementation uses a JSON file directly. For a production setup, this script would be used to populate a live Firestore database.

## Building for Production

To create a production-ready build of your application, run:

```bash
npm run build
```
This command optimizes your application for performance and outputs the static files to the `.next` directory.


## Deployment to Firebase App Hosting (Recommended)

This project is configured to be deployed with **Firebase App Hosting**, which is the recommended way to host Next.js applications on Firebase as it supports all features.

1.  **Install the Firebase CLI**
    If you don't have it installed already, run this command in your terminal:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Log in to Firebase**
    Log in to the Google account associated with your Firebase project:
    ```bash
    firebase login
    ```

3.  **Initialize Firebase in Your Project**
    If you haven't already connected this local project to Firebase, run the following command in the root directory:
    ```bash
    firebase init
    ```
    When prompted:
    -   Choose **"App Hosting: Configure and deploy Firebase App Hosting sites"**.
    -   Select the Firebase project you want to deploy to.
    -   Follow the remaining prompts, accepting the defaults. This will set up the connection between your local project and Firebase.

4.  **Deploy Your Application**
    After initialization, deploy your application with a single command:
    ```bash
    firebase deploy
    ```

After the command finishes, the CLI will provide the URL where your live application is hosted. Your site is now live on the web!
