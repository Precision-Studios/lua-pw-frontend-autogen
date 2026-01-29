Based on your updated specification and clarifications, here are the finalized **Next.js Frontend User Stories**.

These stories specifically address the **Oauth-first** flow, **Client-side QR generation**, and the **New List URLs** endpoint.

## Epic: Authentication & Access Control
This epic handles the Oauth handshake, session management, and access states (Banned/Incomplete).

### 1. OAuth Callback & Session Initialization
**As a** user returning from Google/GitHub,
**I want to** automatically sign in and be routed to the correct page,
**So that** I don't have to manually interact with the login form.

**Implementation Flow:**
*   **Route:** `/auth/success` (Standard callback page).
*   **RouteL** `/auth/failure` (Standard callback page). redirect to `/login`.
*   **Action:** On mount, immediately trigger `POST /api/v1/auth/refresh` to exchange the refresh cookie for the `jwt_token`.
*   **Validation:**
    *   If the refresh fails, redirect to `/login`.
    *   If successful, fetch `GET /api/v1/user/details`.
*   **Routing Logic:**
    1.  **If `active` is false:** Redirect to `/account-suspended`.
    2.  **If `setupComplete` is false:** Redirect to `/setup-password`.
    3.  **Else:** Redirect to `/dashboard`.

### 2. Mandatory Password Setup
**As a** first-time Oauth user,
**I want to** set a password for my account,
**So that** I can complete my registration and have a backup login method.

**Implementation Flow:**
*   **Route:** `/setup-password` (Protected route).
*   **Constraint:** This page should only be accessible if `setupComplete` is `false`.
*   **Form:** A simple form for `newPassword`.
*   **Action:** Submit to `POST /api/v1/user/update`.
*   **On Success:** Update local state to `setupComplete: true` and redirect to `/dashboard`.

### 3. Account Suspended View
**As a** suspended user,
**I want to** see a clear message explaining why I cannot access the dashboard,
**So that** I know to contact support.

**Implementation Flow:**
*   **Route:** `/account-suspended`.
*   **Logic:** If the user is authenticated but `active` is `false`, force them to this route.
*   **UI:** Display a static "Account Disabled" message and a "Contact Support" button. Disable all navigation to functional parts of the app.

***

## Epic: URL Management (Dashboard)
This epic covers creating, listing, and interacting with URLs.

### 4. URL History Dashboard
**As a** user,
**I want to** see a list of all my shortened URLs,
**So that** I can find old links, check their expiry, or share them again.

**Implementation Flow:**
*   **Data Source:** Call `GET /api/v1/user/all`.
*   **UI Component:** A data table displaying:
    *   Original URL (truncated).
    *   Short URL (clickable).
    *   Creation Date (`createdAt`).
    *   Expiry Date (`expireAt`).
    *   Status Badges (e.g., "QR Active").
*   **Empty State:** If the list is empty, show a friendly illustration prompting them to shorten their first link.

### 5. Create Short URL
**As a** user,
**I want to** shorten a link directly from the dashboard,
**So that** I can quickly share it.

**Implementation Flow:**
*   **Action:** Submit `longUrl` to `POST /api/v1/urls/shorten`.
*   **UI Update:**
    *   On success, prepend the new object (returned by API) to the local Dashboard list (optimistic update or re-fetch).
    *   Show a "Copied to Clipboard" toast.

### 6. Client-Side QR Generation & Tracking
**As a** user,
**I want to** generate and download a QR code for a specific short link,
**So that** I can print it or share it visually.

**Implementation Flow:**
*   **Trigger:** User clicks a "QR Code" icon on a row in the Dashboard table.
*   **Frontend Logic:**
    1.  Use a React library (e.g., `react-qr-code` or `qrcode.react`) to render the QR canvas/SVG locally using the `shortUrl`.
    2.  Allow the user to download the image.
*   **Backend Sync:**
    *   *If* `isQRActivated` is false for that link, silently call `POST /api/v1/urls/add_qr` with `{ "urlForQR": "shortUrl" }`.
    *   This ensures the backend analytics know this link is being used as a QR code, without the backend having to generate the image itself.

***

## Epic: System & Configuration
Technical stories for routing and state maintenance.

### 7. Silent Session Refresh
**As a** user,
**I want** my session to stay active while I work,
**So that** I am not logged out unexpectedly.

**Implementation Flow:**
*   **Interceptor:** Configure the HTTP client (Axios/Fetch) to catch `401` errors.
*   **Recovery:** Call `POST /api/v1/auth/refresh`.
    *   **Success:** Retry the original failed request.
    *   **Failure:** Redirect to `/login`.

### 8. Short Link Rewrites
**As a** visitor,
**I want** to click a short link and be handled by the server,
**So that** the redirection works correctly.

**Implementation Flow:**
*   **Configuration:** Update `next.config.js`.
*   **Rule:** Add a rewrite or proxy rule that forwards any path matching the shortcode pattern (e.g., `/[a-zA-Z0-9]{8}`) directly to the Backend API URL.
*   **Exclusion:** Ensure standard frontend routes (`/dashboard`, `/login`, `/auth/*`) are NOT forwarded.

### 9. User Password Management
**As a** fully active user,
**I want to** change my password from my profile settings,
**So that** I can maintain the security of my account or rotate my credentials.

**Implementation Flow:**
*   **Location:** accessible via a "Settings" or "Profile" tab in the Dashboard.
*   **UI:** A form accepting a `newPassword`.
    *   *Enhancement:* Ideally, include a "Confirm Password" field on the frontend for validation, though only `newPassword` is sent to the API.
*   **Validation:**
    *   Frontend must enforce the schema constraints (Min 12, Max 16 characters) before submission.
*   **Action:** Submit the payload to `POST /api/v1/user/update`.
*   **Feedback:**
    *   **Success:** Show a toast notification ("Password updated successfully") and clear the form. Do **not** log the user out; the session remains valid.
    *   **Error:** Handle potential 400 Bad Request if the password doesn't meet backend criteria.