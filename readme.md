# Opencart generator 

## Script

### generate opencart 2.3.x.x extension module
```
$ gulp gmodule --modulename opencart_module_name
```
### generate opencart 2.3.x.x extension payment module
```
$gulp gnewpayextension --modulename test_module_name
```
### generate opencart 2.3.x.x new page "common/newpage"
```
$gulp gnewpage --newpagename new_page_name
```

## How to config stylelint
```
конфига читать вот это: https://stylelint.io/user-guide/configuration/
перевод на русском: https://github.com/MerrickGit/material/blob/master/styleLint/02-Rules.md 
https://github.com/MerrickGit/material
https://stylelint.io/user-guide/configuration/
```
### Нужно установить плагин. 	
npm install --save-dev stylelint

### В конфиге vscode
```
	{
	"stylelint.enable": true,
	"css.validate": false,
	"scss.validate": false
	}
```