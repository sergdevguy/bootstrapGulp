# Starting-template

Ready template for starting development.  

With:  
1) JQuery
2) Bootstrap:  
  a) reboot   
  b) greed  
  c) carousel
___
### START
For starting do:
1. git clone "repository URL" - clone files from github.
2. yarn install - install all packages.
3. gulp - command for start tasks. Open in browser and etc.

___
### STRUCTURE
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

___
### LIBS
You can delete libs in "main" classes. CSS libs in _main.css_ file, JS libs in _main.js_ file.
