test:
	@unzip test/testRepo.zip -d test/
	@./node_modules/.bin/mocha --ignore-leaks 
	
.PHONY: test
