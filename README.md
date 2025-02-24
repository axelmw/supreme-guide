# Supreme Guide

This is a basic Node.js project created as part of a tutorial. It demonstrates how to set up a simple Node.js application that outputs a message when run.

## How to Run the Project

1. **Install Node.js**:
   - Make sure Node.js is installed on your computer. You can download it from [Node.js Official Website](https://nodejs.org/).

2. **Clone the Repository**:
   - Clone this repository to your local machine:
     ```bash
     git clone https://github.com/axelmw/supreme-guide.git
     ```

3. **Navigate to the Project Folder**:
   - Open a terminal and navigate to the project folder:
     ```bash
     cd supreme-guide
     ```

4. **Run the Application**:
   - Execute the following command to run the Node.js application:
     ```bash
     node myfirst.js
     ```

5. **Output**:
   - You should see the output from the program in your terminal.

# API for Inkluderingsprosjektet

Dette er API-et for å administrere datastrukturen i et tre.  
API-et støtter CRUD-operasjoner (Create, Read, Update, Delete).  

## 🌍 Live API på Render:
[https://supreme-guide-hect.onrender.com](https://supreme-guide-hect.onrender.com)

## 📌 API-endepunkter
- **GET** `/api/tree` - Hent hele treet
- **POST** `/api/tree` - Legg til en node
- **PUT** `/api/tree/:id` - Oppdater en node
- **DELETE** `/api/tree/:id` - Slett en node
