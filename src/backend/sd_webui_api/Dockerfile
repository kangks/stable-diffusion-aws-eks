FROM ghcr.io/allenai/pytorch:2.0.0-cuda11.8-python3.10-v1.2.3

RUN apt update && apt install wget git libgl1-mesa-glx libcairo2-dev -y
RUN pip install opencv-python-headless
RUN pip install install -U -I --no-deps xformers==0.0.20

RUN mkdir -p /opt/ml/code
WORKDIR /opt/ml/code

RUN git clone -b v1.7.0 --single-branch https://github.com/AUTOMATIC1111/stable-diffusion-webui.git /opt/ml/code
RUN python launch.py -f --exit --skip-torch-cuda-test
RUN pip install -U pytorch_lightning==1.6.5 pydantic==1.10.11

RUN git clone https://github.com/Mikubill/sd-webui-controlnet.git /opt/ml/code/extensions/sd-webui-controlnet

ENV MPLCONFIGDIR=/tmp TRANSFORMERS_CACHE=/tmp

ENV SD_MODEL_CHECKPOINT="v1-5-pruned-emaonly.safetensors"

COPY serve.sh /opt/ml/code

ENTRYPOINT ["/bin/bash"]
CMD  ["/opt/ml/code/serve.sh"]
