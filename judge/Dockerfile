FROM ubuntu:latest
WORKDIR /app
ADD ./go-judge_1.8.5_linux_386 .

RUN apt update && apt install -y build-essential && chmod 777 ./go-judge_1.8.5_linux_386

CMD ["./go-judge_1.8.5_linux_386"]