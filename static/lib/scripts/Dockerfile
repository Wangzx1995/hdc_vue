FROM trzeci/emscripten:sdk-tag-1.38.32-64bit

ENV CPPFLAGS=-I/usr/local/include
ENV LIBS=-L/usr/local/lib
ENV LDFLAGS=-L/usr/local/lib

RUN curl -s https://nchc.dl.sourceforge.net/project/lzmautils/xz-5.2.4.tar.gz | tar zx -C ~/ \
  && cd ~/xz-5.2.4 \
  && emconfigure ./configure --disable-shared \
  && emmake make \
  && emmake make install

RUN curl -s https://www.libarchive.org/downloads/libarchive-3.3.3.tar.gz | tar zx -C ~/ \
  && cd ~/libarchive-3.3.3 \
  && emconfigure ./configure --enable-static --disable-shared --enable-bsdtar=static --enable-bsdcat=static --enable-bsdcpio=static --enable-posix-regex-lib=libc \
  --disable-xattr --disable-acl \
  --without-cng \
  --without-nettle --without-openssl --without-xml2 --without-expat \
  && emmake make \
  && emmake make install
