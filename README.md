# Gallery app

#### To run this app locally, you will need:
- Node.js
- MongoDB
- TypeScript
- Angular CLI

#### When you complete all installations
 1. Clone project to your computer
 2. Run ``` npm install ```
 3. Run mongoDB on default port or change settings inside ``` src/node/models/db.model.ts/ ```
 4. Run ``` npm run compile ``` one time
 5. Run ``` npm run dev ``` 
 6. It should be up and running on ```localhost:3000```

#### Known issues
- Upon uploading a big amount of pic at the same time, response, which contains src's comes earlier than pics are actually saved

