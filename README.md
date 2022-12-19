# Albelli test

This repository contains a basic test task implementation.

### Scenario #1 usage 
- [x] The user can select an image file via "file selector" from his/her device and import it into the application
- [x] The user can position this photo on a canvas using "Move Up", "Move Down", "Move Left", "Move Right" buttons appropriate.
- [x] Photo is always cover the full canvas and stays unchanged reaching corner case position(s) 
- [x] Hit a "Save..." button generate the print description and save it locally within as a "json" file


### Scenario #2 usage
- [x] The user can select a json file via "file selector" which loads a previously saved JSON description; 
- [x] Upon next image file selection / loading, the application show a canvas that contains the photo with applied description/preferences per photo id accordingly;
- [x] Photo is positioned as expected according to the loaded print descriptions

### General
* A photo description has the following properties: width, height, x and y (all in **inches**).
* Appropriate "inch" to pixels and vise versa values conversion performed via **PhotoDescriptionBuilder**.
* *JsonFileLoader* is used as "Importer" of *PhotoViewer* print description info(s)
* *JsonFileExporter* is used as "Exporter" of *PhotoViewer* print description info(s)
* *LocalImageLoader* is used as "Importer" of *PhotoViewer* image / photo;
* *ClassFactory* / *appFactoryConfig* are used to play in (with) / simulate "IOC" approach and have less coupling;
* Application **setup/initialization** performed via meaningful methods in the *app/js/main.js*


There is attempt to not use any framework(s). 
There is "Typescript / JSDoc type(s) / annotation(s)" is used to have support type(s) checking on fly via IDE's 
