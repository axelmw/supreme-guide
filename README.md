# Supreme Guide - API for Inkluderingsprosjektet

Dette er et REST API for å administrere en trebasert datastruktur for et inkluderingsprosjekt.  
API-et støtter full CRUD-funksjonalitet (Create, Read, Update, Delete).

## Live API på Render:
🔗 **Base URL:** https://supreme-guide-hect.onrender.com

## API-endepunkter

### Hente data:
- `GET /api/tree` - Henter hele treet.

### Opprette en node:
- `POST /api/tree` - Legger til en ny node.
  - **Body:**
    ```json
    {
      "name": "Ny Node",
      "parent_id": 1
    }
    ```

### Oppdatere en node:
- `PUT /api/tree/:id` - Oppdaterer en eksisterende node.
  - **Body:**
    ```json
    {
      "name": "Oppdatert navn"
    }
    ```

### Slette en node:
- `DELETE /api/tree/:id` - Sletter en node.

---

## Hvordan kjøre prosjektet lokalt
### Installer avhengigheter:
```sh
npm install

🔐 **Merk:** `.env`-filen inneholder `DATABASE_URL` og må settes opp for at API-et skal koble til databasen riktig.
