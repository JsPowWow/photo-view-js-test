# Albelli test

This repository contains a basic test task implementation.

### Scenario #1 usage 
- [x] The user can select an image file from his/her device and import it into the application
- [x] The user can position this photo on a canvas using "Move Up", "Move Down", "Move Left", "Move Right" buttons appropriate.
- [x] Photo is always cover the full canvas and stays unchanged reaching corner case position(s) 
- [x] Hit a "Save..." button generate the print description and save it locally within as a "json" file


### Scenario #2 usage
- [x] The user can select a json file which loads a previously saved JSON description; 
- [x] Upon next image file selection / loading, the application show a canvas that contains the photo with applied description/preferences per photo id accordingly;
- [x] Photo is positioned as expected according to the loaded print descriptions

### General
- [x] A photo description has the following properties: width, height, x and y (all in **inches**).

### Nice to have
- [x] Fix the HOR/VER scroll step scale correct
- [ ] Refer to public own props in classes
- [ ] MouseDown / Move / Leave live scrolling, positioning
- [ ] Layout / design proper the toolbar controls
- [ ] Add reset to default pos button
