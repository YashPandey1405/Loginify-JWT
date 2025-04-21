## Global Variable Middleware for User Authentication

This middleware checks if a user is logged in by examining the request's cookies for an `accessToken`. It makes the authentication status available globally across all templates, allowing you to conditionally render content based on whether the user is authenticated.

```javascript
// Middleware to set global variables in templates
app.use((req, res, next) => {
  res.locals.validUser = req.cookies?.accessToken || null; // Set validUser based on accessToken in cookies
  next();
});
```

#### How It Works:

- **Purpose**:  
  The middleware sets a `validUser` variable in `res.locals` that is accessible to all EJS templates. This variable helps determine if a user is logged in.

- **Authentication Check**:

  - The middleware looks for an `accessToken` in the request cookies (`req.cookies?.accessToken`).
  - If an `accessToken` is found, `validUser` is set to the token value (indicating the user is logged in).
  - If no token is found, `validUser` is set to `null` (indicating the user is not logged in).

- **Usage in Templates**:

  - The `validUser` variable can be used in EJS templates to conditionally render content, like login/signup or logout links.

    Example:

    ```html
    <% if (!validUser) { %>
    <li><a href="/login">Login</a></li>
    <li><a href="/signup">Signup</a></li>
    <% } else { %>
    <li><a href="/logout">Logout</a></li>
    <% } %>
    ```

#### Benefits:

- **Global Access**:  
  `validUser` is available in all templates without the need to pass it explicitly every time a page is rendered.
- **Simplifies UI Logic**:  
  Conditionally renders UI elements based on the user's authentication state, enhancing the user experience.

#### Example Workflow:

1. **Logged In**: If the user has a valid `accessToken` in the cookies, `validUser` will contain the token, and the template can render the "Logout" link.
2. **Not Logged In**: If no `accessToken` is found, `validUser` will be `null`, and the template can render the "Login" and "Signup" links.

This middleware ensures that your app correctly handles user authentication and renders content based on the user's login state.
