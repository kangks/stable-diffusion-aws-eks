#!/bin/sh

trap "handle_exit" TERM INT QUIT HUP

handle_exit(){
    echo "cleaning up..."

# USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
# 10001         34  0.1  0.1 856820 19760 ?        Ssl  07:04   0:00 /xray -t 0.0.0.0:2000 -b 0.0.0.0:2000
# root          16  0.0  0.0   2576   920 ?        Ss   07:04   0:00 /bin/sh ./entrypoint.sh python3 -u main.py
# root          78  0.0  0.0   8480  4224 ?        R    07:04   0:00  \_ ps auxfwww
# root           7 56.3 35.3 18437844 5670124 ?    Ssl  07:04   0:24 python ./launch.py -f --api --skip-prepare-environment --no-hashing --listen --port 8080 --xformers --ckpt v1-5-pruned-emaonly.safetensors --ckpt-dir /tmp/models/stable-diffusion --controlnet-dir /tmp/models/controlnet --lora-dir /tmp/models/lora --vae-dir /tmp/models/vae
# root           1  0.0  0.0    972     4 ?        Ss   07:03   0:00 /pause

    curl -XPOST -kv "http://localhost:8080/sdapi/v1/server-stop"
    pkill xray
}

python3 -u main.py
exit_code=$?

ps auxfwww

echo "Cleaning up..."
handle_exit
echo "exting..."
exit ${exit_code}