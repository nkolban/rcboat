all:
	@echo "run - Run the app"
	@echo "testMPU9250 - Test the MPU9250"
	@echo "deps - Install the deps into public"

run:
	sudo node run.js

testMPU9250:
	sudo node testMPU9250.js

deps:
	cd public
	wget https://code.jquery.com/jquery-3.4.1.js
	wget https://raw.githubusercontent.com/jonobr1/two.js/master/build/two.js
	wget https://github.com/manuelbieh/geolib/archive/v3.0.4.zip
