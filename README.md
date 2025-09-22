Problem definition

After a series of discovery calls we found out a problem that one of our users is facing. They are having a hard time sharing their memories with friends and family. They are using a combination of social media, messaging apps, and email to share their memories. They are looking for a solution that allows them to store and share their memories in a single place.

As a first iteration for this solution, we want to build a web application that allows a user to create and manage their memory lanes and share it with friends and family. A memory lane is a collection of events that happened in a chronological order. Each memory consists of a title, a description, a timestamp, and at least one image.

For this exercise, you are not required to make this work for multiple users with an auth system. You are not required to make a user system. You should create a simple auth system so that only users with the credentials can make edits. Users that aren't logged in with the credentials should only be able to view the memories.

Deliverables

Create your own repository from scratch (do not fork this one). Implement the solution in your own separate repository and share the link when submitting.
An updated README providing a high level explanation of your implementation.
The provided mockup is only for reference and inspiration. Feel free to improve it!
A Typescript and React app that allows creation/edit/deletion of memories by users with the credentials (simple auth system, not multi user auth system).
Use a database that would be appropriate for a early stage to mid stage startup.
The app should have 2 views: a view for a single memory lane and a view for the list of memory lanes. Each memory lane consists of many memories.
Provide a preview link hosted on a thirdparty.
FAQ

Can I use AI tools? Absolutely. Use whatever tools help you complete the task the fastest.
Is user authentication required? No, it is not required. The only requirement is to require credentials to make edits.
Can I use a component library? Yes, you can use a component library -- especially if it helps you complete the assignment faster.
What will you be looking for? Good user experience, reusable code, and a well thought out technical design. Proper organization of code and proper data model design. Tests are not necessary.
Closing notes

You will be asked to explain details of your implementation and tradeoffs so make sure you understand any code generated with AI tools.

Implementation

Tech Stack

Next.js App Router (TypeScript, React) with server components for data fetches and client components for interactive forms, sorting, sharing, etc.
Prisma ORM targeting Supabase Postgres; the Prisma client is instantiated in lib/prisma.ts and consumed in server components and API routes.
iron-session manages a single shared “editor” login; credentials are stored in env vars and persisted in cookies.
Supabase Storage (via @supabase/supabase-js) holds uploaded images; the service role key is used server-side in the upload/delete routes.
Styling leans on Tailwind-style utility classes (via global CSS) plus a few lucide-react icons. No custom design system.
High-Level Architecture

Pages
app/page.tsx is still the boilerplate Next landing page.
app/lanes/page.tsx (server component) fetches all lanes with their memories, passes data to LanesClient (client component) which renders the dashboard, CRUD form for lanes, and per-lane delete buttons.
app/lanes/[id]/page.tsx (server) fetches a single lane with nested memories/images and hands off to LaneClient (client) for interactive memory/image management, clipboard sharing, and lane deletion.
app/login/page.tsx provides the password form for the shared editor login.
API Routes (serverless)
app/api/login and app/api/logout toggle the session flag; logout redirects to /lanes.
app/api/lanes (POST/GET) creates lanes or lists them; app/api/lanes/[id] deletes lanes.
app/api/memories adds memories; app/api/memories/[id] (added earlier) deletes them.
app/api/images handles multipart uploads to Supabase storage; app/api/images/[id] removes images from both storage and DB.
State & UX
Client components manage sort order, copy-to-clipboard feedback, file inputs, and form errors.
Buttons use consistent hover styles (hover:bg-gray-200 or colored variants) to stay visible on white cards.
Data Model (schema.prisma)

lanes: UUID PK, title, optional description, timestamps; related memories cascade on delete.
memories: UUID PK, FK to lane, optional description, occurred_at timestamp, timestamps; has many memory_images.
memory_images: UUID PK, FK to memory, public image URL, optional alt/position.
Indices support common queries (lane_id sorted by occurred_at, etc.).
Contextual Decisions

A shared admin password (no multi-user auth) matched the requirement for “simple credentials to edit.” iron-session was chosen for minimal state management without rolling a full user system.
Supabase was selected for both Postgres and object storage, simplifying hosting and allowing signed URLs/service-role operations directly from server routes.
Client components handle forms so we can stay in the App Router without legacy pages; server components keep Prisma queries on the server and avoid shipping secrets.
Lane deletion redirects back to /lanes to keep the editing flow focused on the dashboard.
Clipboard-based sharing provides quick “send the lane link” functionality without external integrations.


HERE'S A LINK TO TEST IT OUT:
https://planned-assessment-mario-bitar.vercel.app/lanes