FROM ubuntu:latest
WORKDIR /app
ADD ./go-judge_1.8.5_linux_386 .

RUN apt update && apt install build-essential

CMD ["./go-judge_1.8.5_linux_386"]