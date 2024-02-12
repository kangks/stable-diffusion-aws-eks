FROM public.ecr.aws/docker/library/python:3.10.12-slim

RUN apt-get update
RUN apt-get install -y procps curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip3 install --no-cache-dir --upgrade pip && \
    pip3 install --no-cache-dir -r requirements.txt

COPY entrypoint.sh ./
RUN chmod +rx ./entrypoint.sh

COPY main.py ./

# ENTRYPOINT [ "tini", "--", "./entrypoint.sh" ]
CMD ["./entrypoint.sh", "python3", "-u", "main.py"]
