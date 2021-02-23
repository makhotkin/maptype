@echo off
call _minify.bat map-tileset.js 
call _minify.bat map-component.js 
call _minify.bat map-control.js 
call _minify.bat map-marks.js 
type ..\min\map-*.js > ..\map.js
echo Map processed

call _minify.bat jquery.form.js 
rem call _minify.bat jquery.delay.js 
rem call _minify.bat jquery.rightClick.js
call _minify.bat jquery.history.js
copy jquery-min.js ..\min\jquery-min.js
type ..\min\jquery-min.js > ..\min\jquery.js
type ..\min\jquery.*.js >> ..\min\jquery.js
copy ..\min\jquery.js ..\jquery.js
echo jQuery processed

call _minify.bat page-core.js
copy ..\min\page-core.js ..\min\page.js
del ..\min\page-core.js
call _minify.bat page-lang.js 
call _minify.bat page-tpl.js
call _minify.bat page-utils.js 
type ..\min\page-*.js >> ..\min\page.js
echo CPage processed

call _minify.bat profile-core.js
type ..\min\profile-*.js > ..\profile.js
echo Profile processed

call _minify.bat ctrl-overlay.js 
call _minify.bat ctrl-paginator.js
call _minify.bat ctrl-dropdown.js
call _minify.bat ctrl-lightbox.js 
call _minify.bat ctrl-search.js 
call _minify.bat ctrl-rating.js 
call _minify.bat ctrl-rrr-2.js 
call _minify.bat ctrl-msgbox.js
call _minify.bat ctrl-mainlist.js
call _minify.bat ctrl-tooltip.js
call _minify.bat ctrl-date-select.js
call _minify.bat ctrl-command.js
call _minify.bat ctrl-loading.js
type ..\min\ctrl-*.js > ..\min\controls.js
echo Misc controls processed

type ..\min\page.js ..\min\controls.js > ..\page.js
del ..\min\*.js