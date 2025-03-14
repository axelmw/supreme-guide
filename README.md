# Supreme Guide - API for Inkluderingsprosjektet

Dette er et REST API for å administrere en trebasert datastruktur for et inkluderingsprosjekt.  
API-et støtter full CRUD-funksjonalitet (Create, Read, Update, Delete).

## Live API på Render:
**URL for kortstokk API:** 
https://supreme-guide-hect.onrender.com

**URL for PostgreSQL-database trestruktur API:** 
https://supreme-guide-hect.onrender.com/api/tree

## Sessions-mellomvare (vedvarende økter)
Dette prosjektet inkluderer en mellomvare for å lagre sesjonsdata i PostgreSQL, slik at brukerøkter bevares selv om serveren starter på nytt.

- Bruker `express-session` og `connect-pg-simple` for å lagre sesjonsdata i PostgreSQL.
- Øktdata lagres i tabellen **`session`** i databasen.
- Brukersesjoner bevares selv etter en serverrestart.

## API-endepunkter

### Hente data:
- `GET /api/tree` - Henter hele treet.

### Opprette en node:
- `POST /api/tree` - Legger til en ny node.
  - **Body:**
    ```json
    {
      "name": "Ny Node",
      "parent_id": 8
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

**Merk:** `.env`-filen er kun nødvendig for lokal kjøring.  
API-et kjører allerede på Render, så du kan teste det via live URL-er.  
Hvis du ønsker å kjøre lokalt, må du bruke din egen PostgreSQL-database og sette opp en `.env`-fil slik:  