# Starting-template

Ready template for starting development.  
With bootstrap greed. 

For starting do:
1. git clone "repository URL" - clone files from github.
2. yarn install - install all packages.
3. gulp - command for start tasks. Open in browser and etc.

Template structure:
1. *assets/build* - prodaction folder
2. *assets/src* - dev project folder
3. *.gitignore* - ignored files
4. *gulpfile.js* - task runner with tasks on gulp 4:
    - gulp
    - browser-sync
    - gulp-sourcemaps
    - gulp-sass
    - gulp-autoprefixer
    - gulp-clean-css
    - gulp-uglify
    - del
    
5. *package.json* - dependencies and devDependencies info
6. *yarn.lock* - just for yarn
