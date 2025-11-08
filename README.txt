
Time Star - Editable Website Package
------------------------------------

Files included:
- index.html           -> Home page
- shop.html            -> Products listing page
- product.html         -> Product detail template (uses ?id=PRODUCT_ID)
- assets/style.css     -> Styles
- assets/script.js     -> JavaScript logic to load products from data/products.json
- data/products.json   -> Product data (edit this to add/remove products)
- images/              -> Product images
- README.txt           -> This file (instructions)

How to add a new product (quick):
1. Add your product image to the images/ folder (recommended size 800x800).
2. Open data/products.json in a text editor.
3. Copy one product object (blocks between { ... }) and paste a new one.
4. Change "id", "name", "price", "price_raw", "description", "image", "category", "stock".
   Example entry:
   {
     "id": "TS004",
     "name": "TimeStar New Watch",
     "price": "₹1,999",
     "price_raw": 1999,
     "currency": "INR",
     "description": "Short description here.",
     "image": "images/newwatch.png",
     "category": "Men",
     "stock": 10
   }
5. Save the file and open shop.html in your browser (or re-deploy). The new product appears automatically.

How to remove a product:
- Open data/products.json and delete the product object corresponding to that product.
- Save and refresh shop.html.

How to edit a product:
- Edit the fields (name, price, description, stock, image) in data/products.json and save.

Hosting the website (free):
Option 1 - GitHub Pages (recommended for static sites):
1. Create a GitHub repository and push all files (index.html, shop.html, product.html, assets/, data/, images/).
2. In repository Settings -> Pages -> Source -> select main branch and / (root).
3. Your site will be live at https://<username>.github.io/<repo-name>/

Option 2 - Netlify:
1. Sign up at netlify.com and drag & drop the folder in Sites -> New site from folder.
2. Site will be deployed automatically.

Notes:
- This demo does not include a backend/cart/payment system.
- For a production store with payments, you can integrate a payment gateway (Razorpay/Stripe) or use platforms like Square/Ecwid/Wix.
- If you want, I can integrate a simple admin UI later so you can add products without editing JSON.

Need help deploying? Tell me which option you prefer (GitHub Pages or Netlify) and I will give step-by-step commands.


Admin page:
- admin.html provides a browser-based editor to add/edit/delete products.
- Use 'Download products.json' to save your changes and replace data/products.json in your repo.
- You can upload product images; these will be embedded as base64 in the exported JSON.


Netlify Auto-Publish (One-click deploy)
--------------------------------------
You can configure a Netlify serverless function to accept the products JSON from the admin page and commit it directly to your GitHub repo, which will trigger Netlify automatic deploys.

Steps:
1. Create a GitHub repository (e.g., 'timestar-site') and push all website files (index.html, shop.html, admin.html, product.html, assets/, data/, images/).
2. Connect this GitHub repo to Netlify:
   - In Netlify, choose "New site from Git" -> GitHub -> select your repo -> set branch (e.g., main) -> deploy site.
3. Add the serverless function:
   - Place the file 'netlify_functions/publish.js' in your project root (Netlify will use it as a function if configured as '/.netlify/functions/publish').
   - In Netlify site settings, under "Build & Deploy" -> "Functions", ensure functions directory is set appropriately (default is 'netlify_functions').
4. Create a GitHub Personal Access Token:
   - On GitHub, go to Settings -> Developer settings -> Personal access tokens -> Tokens (classic) -> Generate new token.
   - Select 'repo' scope (full control of private repositories if your repo is private). Copy the token.
5. Set Netlify environment variables (Site settings -> Build & deploy -> Environment):
   - REPO_OWNER = your GitHub username or org (e.g., 'yourusername')
   - REPO_NAME = your repository name (e.g., 'timestar-site')
   - BRANCH = branch name (e.g., 'main')
   - GITHUB_TOKEN = the personal access token from GitHub
6. Deploy the site on Netlify. Once deployed, open the hosted admin page (https://<your-site>.netlify.app/admin.html).
7. Use Admin -> Add/Edit products -> Click 'Publish to Netlify (auto-deploy)'.
   - The admin page will POST products to the function, which commits to GitHub. Netlify will detect the commit and auto-deploy the updated site.

Security note:
- Keep GITHUB_TOKEN secret. Use repo scope only for the specific repo, or a dedicated machine user for the token.
- Do not embed tokens in client-side code. The token is stored on Netlify server-side (environment variables).

If you'd like, I can prepare a new ZIP with the netlify functions folder included (ready to push). Would you like that? (I can generate the ZIP for you now.)
