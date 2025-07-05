# Book-Recommendation-Catalogue

Welcome to Book Catalogue! Mark your progress on any book and let the book be visible to the world.

Solution Approach: 
  - A book catalogue system where the user can add books to their catalogue by marking its reading progress (READ, READING, WANT TO READ).
  - Pages:
      - Home (Library): This is the first page a user sees when they visit the website. There are multiple books added here. User can click on any book to know about the book and mark its progress by clicking                          on any of its status. Books are automatically added to the library when any user first marks their progress. Think of it like a central social hub where you can add anything to it and                           any one can see it. If two users adds the same books to the public library, the books are not duplicated. More the users marks progress on new books, more the library grows.
      - Catalogue (login required): This is the page where the user can see all the books they have added to their catalogue simply by marking its progress. The user can filter the catalogue by genre and                                           publication year. When the user decides to remove their progress, the book is automatically removed from the catalogue but not from the library.
      - Recommendations (login required): User preferences are stored in the db for recommendation purpose. User is recommended books by their preferred genres and these books are also filtered down to their                                             minimum publication year and minimum book length they have chosen. The books are grouped and ordered by the genres and fetched everytime on refresh so that fresh                                               ones are sent everytime. Here again, user may click on any book and mark their progress.
      - Progress (login required): The user is displayed their reading progress ordered by their status. An interactive pie chart is displayed where user can select a status and check books marked with that                                       status. And also a progress chart where how many books are read out of all the books saved in the catalogue.
      - Search: Anyone may search for any book by its title or isbn. Input validation is ensured where the user cannot send alphabets while searching by ISBN and can only have 10 or 13 digits. Here again,                     atleast 7 results are shown per search and user may add the book to the catalogue.
      - Settings: User can view their preferences like the selected genres, minimum publication year and preferred book length (short, medium, long). User can change the preferences whenever their wish and                     their recommendations system is also updated automatically. user cannot leave the genres empty by deselecting all here to avoid problems.
      - Login: Simple password login page with error validation by showing a toast message on error and input validation for email and password.
      - Register: Register using email and password with input validation where password is matched with regex for having atleast one special char, number and one cap letter.
      - Config: This is the page the user visits after registering. They can choose their preferred genres, preferred minimum publication year and preferred book length. User has to select atleast one genre                   to continue. If for some reason, user could not visit this page (maybe browser closed after registering or lost connectivity), the user will be redirected once again to this page on login.
      - Book: User can click on any book to read its title, author, genre, description and marks its progress by clicking on the status. Clicking on the current status will remove the book from user's personal catalogue. If he/she is not logged in, then the user is prompted to login, when clicking on the status. Right below, books of the same genre is fetched and shown to the user, the books are fetched everytime the genre of the current book shown on the page changes. 

  - Features:
      - View any book from the public library or by searching by title or ISBN.
      - Public library hub where anyone can add a book for the world to see just by marking progress making it a social hub encouraging others to read and discovering new books.
      - View progress of books read, reading, want to read and ability to filter progress by status and view books marked as that status.
      - Book recommendation system based on genre, pub year and book length.
      - View recommeded books of the same genre when visiting any book.
      - View personal catalogue and the ability to remove and add book to/from the catalogue.
      - Change personal preference anytime.

  - Tech Stack:
      - Frontend: React(Typescript), Tailwind CSS, Shadcn (components), lucide-react (icons).
      - Backend: Node.js, Express, Firebase(auth)
      - DB: mysql
        
  - Architecture:
      - Security:
          - JWT Tokens: Auth is completely done on the backend to separate business logic from UI. User generates access and refresh token on login/sign up. The tokens are saved on the cookies instead of                            sending it back and storing it locally which can be a security risk. Tokens are also verified on every request.
          - Data Validation: Data is validated in the frontend using zod where we can give our own constraints to follow. Validation is also done in the backend so as to avoid sql injection and cross site                                scripting.
          - Catalogue, recommendations, settings, progress pages can only be viewed if the user has logged in
      - DB: A hosted mysql db from freesqldatabase.com is used. All the scripts are attached below.
      - Auth: Authentication is done using firebase. All the auth details are stored securely by firebase. Firebase generate the tokens for use. The uid provided by firebase is used as the user id in the                  users table.
      - 
        
  - Future Ideas:
      - Add point reward system where points are rewarded to the user when he marks any book as read or reading.
      - AI chat bot for asking questions about any book
      - AI image recognition bot for uploading a book image to identify/ask about the book.
      - Add name of user under each book on the library so that anyone can see who all added this book to the library and are reading it (Making it like social media).
      - Ability to add comments under any book.
