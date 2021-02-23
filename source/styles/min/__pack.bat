@echo off

call _minify.bat banner_main.css
call _minify.bat bubble.css
call _minify.bat scrollelem.css
call _minify.bat chart.css
call _minify.bat document.css
call _minify.bat filter.css
call _minify.bat info-block.css
call _minify.bat list.css
call _minify.bat paginator.css
call _minify.bat popup.css
call _minify.bat promo.css
call _minify.bat radiuses.css
call _minify.bat rubricator.css
call _minify.bat tooltip.css
call _minify.bat layer-indexes.css

type tmp\* > ..\components.css