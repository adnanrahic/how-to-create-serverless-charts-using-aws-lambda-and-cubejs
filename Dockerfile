FROM amazonlinux:2
WORKDIR /root/functions
RUN yum install tar gzip -y
COPY . .
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash \
  && . /root/.nvm/nvm.sh \
  && nvm install 8.10.0 \
  && npm i npm@latest -g \
  && npm install

CMD tail -f /dev/null