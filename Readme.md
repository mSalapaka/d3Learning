

Steps for initializing react based frontend with webpack and eslint
----------------------------------------------------------------------
    npm init -y
    
    npm commands for ecmascript transpiling
    -------------------------------------
        npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/preset-react

    npm commands for webpack bundling
    -----------------------------------
        npm install --save-dev webpack webpack-cli 
        npm  install --save-dev style-loader css-loader babel-loader

    npm commands for eslint
    -----------------------
        npm i -D eslint babel-eslint eslint-plugin-react eslint-plugin-react-hooks

    npm commands for react
        npm install --save react react-dom


Create webpack.config.js as attached. Note the source is src/index.js and output is public/bundle.js

Create  .babelrc

Create .eslintrc.js


Folder Structure
------------------
main root dir
    public/
        index.html (with bundle.js script included, and a div with id root)
    src/
        index.js (main render including App component inserted in id root)
        App.js (the main react component)
        App.css

        components/
            all react components will be placed here

IDE environment
----------------------
In visual studio code install eslint extension ny Dirk Baeumer. Allow esliont to run
In visual studio code install Live Server for Ritwick Dey

On Firefox
------------
include react developer tools

To run this sample project
---------------------------
npx dev webpack

(which will create bundle.js and place it under the public directory)

Use live server to open index.html via vscode to view the index.html (or use any server to serve the static directory 'public')



