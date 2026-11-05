ifeq ($(OS),Windows_NT)
SHELL := C:/PROGRA~1/Git/bin/bash.exe
.SHELLFLAGS := -lc
export MSYS_NO_PATHCONV := 1
endif

IMAGE ?= quotes-scrapper:latest

.PHONY: build run clean ci

build:
	docker build -t $(IMAGE) .

run: build
	mkdir -p out
	docker run --rm --init --ipc=host --mount type=bind,source="$(CURDIR)/out",target=/app/out $(IMAGE)

clean:
	docker image rm $(IMAGE)
	rm -rf out

ci: run
	docker run --rm --mount type=bind,source="$(CURDIR)/out",target=/app/out $(IMAGE) node src/check.js
