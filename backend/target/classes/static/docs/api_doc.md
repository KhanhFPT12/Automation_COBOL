### <h2 align="center">API DOCUMENT FOR USER AND AUTHENTICATION</h2> <h6 align="center"><p>Version: 1.0</p><p>Author: KhangNV19</p></h6>

---

### Admin Registration

Handles admin registration.

#### Request

- **Method:** POST
- **Endpoint:** `/api/v1/auth/signup`
- **Request Body:**

  - `user` (UserDTO): The UserDTO object containing admin user information.
  - Request (application/json)
    ````json
        {
        "firstName": "first name",
        "lastName": "last name",
        "username": "username",
        "password": "{Secure Password}"
        }
        ```
    ````

#### Response

- **Success Response:**

  - **Status Code:** 201 Created
  - **Response Object:**
    ```json
    {
      "status": "success",
      "httpStatus": "CREATED",
      "data": {
        "firstName": "first name",
        "lastName": "last name",
        "username": "username",
        "password": "{Hashed Password}"
      }
    }
    ```

- **Conflict Response:**
  - **Status Code:** 409 Conflict
  - **Response Object:**
    ```json
    {
      "httpStatus": "CONFLICT",
      "error": "The username is already in use in the system"
    }
    ```

---

### User Sign-In

Handles user sign-in and generates authentication tokens.

#### Request

- **Method:** POST
- **Endpoint:** `/api/v1/auth/signin`
- **Request Body:**
  - `user` (UserLoginDTO): The UserLoginDTO object containing user login information.

#### Response

- **Success Response:**
  - **Status Code:** 200 OK
  - **Response Object:**
    ```json
    {
      "httpStatus": "OK",
      "data": {
        "token": "{authentication_token}",
        "rf_token": "{refresh_token}"
      }
    }
    ```

---

### Token Refresh

Handles token refresh operation.

#### Request

- **Method:** POST
- **Endpoint:** `/api/v1/auth/refresh`
- **Request Body:**
  - `entity` (RefreshToken): The RefreshToken object containing the refresh token.

#### Response

- **Success Response:**

  - **Status Code:** 200 OK
  - **Response Object:**
    ```json
    {
      "httpStatus": "OK",
      "data": {
        "token": "{newAuthenticationToken (Access Token)}"
      }
    }
    ```

- **Error Response:**
  - **Status Code:** 403 FORBIDDEN
  - **Response Object:**
    ```json
    {
      "httpStatus": "FORBIDDEN",
      "error": "{TokenRefreshException message}"
    }
    ```

---

### Add User

Handles the addition of a new user.

#### Request

- **Method:** POST
- **Endpoint:** `/api/v1/user`
- **Authorization:** Requires `ADMIN` role
- **Request Body:**

  - `user` (UserDTO): The UserDTO object containing user information.
  - Request (application/json)

    ```json
    {
      "firstName": "first name",
      "lastName": "last name",
      "username": "username",
      "password": "{Secure Password}"
    }
    ```

#### Response

- **Success Response:**

  - **Status Code:** 201 Created
  - **Response Object:**
    ```json
    {
      "status": "success",
      "httpStatus": "CREATED",
      "data": {
        "firstName": "first name",
        "lastName": "last name",
        "username": "username",
        "password": "{Hashed Password}"
      }
    }
    ```

- **Conflict Response:**
  - **Status Code:** 409 Conflict
  - **Response Object:**
    ```json
    {
      "httpStatus": "CONFLICT",
      "error": "The username is already in use in the system"
    }
    ```

---

### Update User

Handles the update of user information.

#### Request

- **Method:** PUT
- **Endpoint:** `/api/v1/user`
- **Authorization:** Requires `ADMIN` role
- **Request Body:**

  - `user` (UserDTO): The UserDTO object containing updated user information.
  - Request (application/json)

    ```json
    {
      "firstName": "first name",
      "lastName": "last name",
      "username": "username"
    }
    ```

#### Response

- **Success Response:**

  - **Status Code:** 200 OK
  - **Response Object:**
    ```json
    {
      "status": "success",
      "httpStatus": "OK",
      "data": {
        "firstName": "first name",
        "lastName": "last name",
        "username": "username",
        "password": "{Hashed Password}"
      }
    }
    ```

- **Not found resource Response:**
  - **Status Code:** 404 NOT_FOUND
  - **Response Object:**
    ```json
    {
      "httpStatus": "NOT_FOUND",
      "error": "The requested resource was not found."
    }
    ```

---

### Update User Password

Handles the update of user password.

#### Request

- **Method:** PUT
- **Endpoint:** `/api/v1/user/password`
- **Authorization:** Requires `ADMIN` role
- **Request Body:**

  - `user` (UserDTO): The UserDTO object containing updated password information.
  - Request (application/json)

    ```json
    {
      "username": "username",
      "password": "New Secure Password"
    }
    ```

#### Response

- **Success Response:**

  - **Status Code:** 200 OK
  - **Response Object:**
    ```json
    {
      "status": "success",
      "httpStatus": "OK",
      "data": {UserDTO}
    }
    ```

- **Error Response:**
  - **Status Code:** 400 Bad Request
  - **Response Object:**
    ```json
    {
      "httpStatus": "BAD_REQUEST",
      "error": "WeakPasswordException"
    }
    ```
- **User not found Response:**

  - **Status Code:** 400 Bad Request
  - **Response Object:**
    ```json
    {
      "httpStatus": "BAD_REQUEST",
      "error": "The requested resource was not found."
    }
    ```

- **Weak password Response:**

  - **Status Code:** 406 NOT_ACCEPTABLE
  - **Response Object:**

    ```json
    {
      "httpStatus": "NOT_ACCEPTABLE",
      "error": "password: The password is weak."
    }
    ```

---

### Delete User

Handles the deletion of a user by username.

#### Request

- **Method:** DELETE
- **Endpoint:** `/api/v1/user/{username}`
- **Authorization:** Requires `ADMIN` role
- **Path Parameters:**
  - `username` (String): The username of the user to be deleted.

#### Response

- **Success Response:**

  - **Status Code:** 202 Accepted
  - **Response Object:**
    ```json
    {
      "status": "success",
      "httpStatus": "OK"
    }
    ```

- **Error Response:**
  - **Status Code:** 400 Bad Request
  - **Response Object:**
    ```json
    {
      "httpStatus": "BAD_REQUEST",
      "error": "{error message}",
      "message": "The requested resource was not found."
    }
    ```

---

# Find All Users

Retrieves all users.

#### Request

- **Method:** GET
- **Endpoint:** `/api/v1/user`
- **Authorization:** Requires `ADMIN` role

#### Response

- **Status Code:** 200 OK
- **Response Object:**

  ```json
  {
    "status": "success",
    "httpStatus": "OK",
    "data": [
      {
        "firstName": "first name",
        "lastName": "last name",
        "username": "username",
        "password": "{Hashed Password}"
      }
    ]
  }
  ```

---

### Find All Users (Paged)

Retrieves a page of users with specified size and page number.

#### Request

- **Method:** GET
- **Endpoint:** `/api/v1/user/{size}/{page}`
- **Authorization:** Requires `ADMIN` role
- **Path Parameters:**
  - `size` (Number): The size of page (The number of users to include in each page)
  - `page` (Number): The page number to retrieve

#### Response

- **Status Code:** 200 OK
- **Response Object:**

  ```json
  {
    "status": "success",
    "httpStatus": "OK",
    "data": [
      {
        "firstName": "first name",
        "lastName": "last name",
        "username": "username",
        "role": "user role"
      }
    ]
  }
  ```

---

### Find User By Username

Retrieves a user by username.

#### Request

- **Method:** GET
- **Endpoint:** `/api/v1/user/{username}`
- **Path Parameters:**
  - `username` (String): The username of the user to retrieve.

#### Response

- **Success Response:**

  - **Status Code:** 200 OK
  - **Response Object:**
    ```json
    {
      "status": "success",
      "httpStatus": "OK",
      "data": {
        "firstName": "first name",
        "lastName": "last name",
        "username": "username",
        "password": "{Hashed Password}"
      }
    }
    ```

- **Not Found Response:**

  - **Status Code:** 400 BAD_REQUEST
  - **Response Object:**
    ```json
    {
      "httpStatus": "BAD_REQUEST",
      "error": "The requested resource was not found."
    }
    ```

  ***
