.PHONY: deploy
t = latest
#ENV = PROD/UAT/DEV
ENV = PROD
modify_env:
	#modify .env file and switch base_url based on ENV
	@if [ "$(ENV)" = "PROD" ]; then \
		echo "Switching to PROD environment"; \
		echo 'BASE_URL="https://bralirwalottery.rw/api"' > .env; \
	elif [ "$(ENV)" = "UAT" ]; then \
		echo "Switching to UAT environment"; \
		echo 'BASE_URL="https://bralirwa.testing.rw/api"' > .env; \
	else \
		echo "Switching to DEV environment"; \
		echo 'BASE_URL="http://localhost:8090"' > .env; \
	fi

deploy: modify_env
	@echo "Building app&image and deploying lottery frontend version:" $(t)
	yarn generate
	@echo "Switching back to DEV environment"
	echo 'BASE_URL="http://localhost:8090"' > .env
	@echo "building and tag lottery image"
	docker build -t qonicsinc/lottery:$(t) .
	@echo "Pushing image to docker hub"
	docker push qonicsinc/lottery:$(t)
	@if [ "$(t)" != "latest" ]; then \
		echo "Build also latest image"; \
		docker build -t qonicsinc/lottery:latest .; \
		echo "Push latest image"; \
		docker push qonicsinc/lottery:latest; \
	fi
	@echo $(t) " lottery image pushed"

push:
	@echo "Building image and deploying lottery frontend version:" $(t)
	@echo "building and tag lottery image"
	docker build -t qonicsinc/lottery:$(t) .
	@echo "Pushing image to docker hub"
	docker push qonicsinc/lottery:$(t)
	@if [ "$(t)" != "latest" ]; then \
		echo "Build also latest image"; \
		docker build -t qonicsinc/lottery:latest .; \
		echo "Push latest image"; \
		docker push qonicsinc/lottery:latest; \
	fi
	@echo $(t) " lottery image pushed"