const fs = require('fs');
const { resolve, parse } = require('path');
const distFolder = resolve(__dirname, 'dist');

const compile = () => {
  fs.readdirSync(distFolder).forEach(variant => {
    let styles = '';
    let script = '';
  
    fs.readdirSync(resolve(distFolder, variant)).forEach(file => {
      const fileName = parse(file).name;
      const fileExt = parse(file).ext;
      const fileData = fs.readFileSync(resolve(distFolder, variant, file), 'utf8');
  
      if (!fileData) {
        console.error(`Error reading ${file}`);
        process.exit(1);
      } 
  
      if (fileExt === '.css') {
        styles = fileData;
      }
  
      if (fileExt === '.js') {
        script = fileData;
      }
    });
  
    writeOfferFile(resolve(distFolder, variant), styles, script);
    writeConsoleFile(resolve(distFolder, variant), styles, script);
  });
}

const writeOfferFile = (path, styles, script) => {
  const styleTag = `<style type="text/css">${styles}</style>`;
  const scriptTag = `<script type="text/javascript">${script}</script>`;
  const fileData = `${styleTag}\n${scriptTag}`;
  writeFile(resolve(path, 'offer.html'), fileData);
}

const writeConsoleFile = (path, styles, script) => {
  const styleTag = `<style type="text/css">${styles}</style>`;
  const injectStyles = `document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', '${styleTag}');`;
  const fileData = `${injectStyles}\n${script}`;
  writeFile(resolve(path, 'console.js'), fileData);
}

const writeFile = (filePath, fileData) => {
  fs.writeFile(filePath, fileData, (err) => {
    if (err) {
      console.error(`Error saving ${filePath}`);
      process.exit(1);
    }
    console.log(`Saving ${filePath}`);
  }); 
}

compile();