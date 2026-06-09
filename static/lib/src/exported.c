#include <archive.h>
#include <archive_entry.h>
#include <emscripten.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include "md5.h"

EMSCRIPTEN_KEEPALIVE
double md5(char* path, unsigned char* md5_result) {
  int CHUNK_SIZE = 16 * 1024 * 1024;
  int MD5_SIZE = 128 / 8;
  double start, end;
  double duration = 0;

  FILE* stream = fopen(path, "r");
  char* buff = malloc(CHUNK_SIZE);
  MD5_CTX md5_ctx;

  size_t read_size;

  start = emscripten_get_now();
  MD5_Init(&md5_ctx);
  end = emscripten_get_now();
  duration += end - start;
  while (1) {
    read_size = fread(buff, 1, CHUNK_SIZE, stream);
    if (read_size > 0) {
      start = emscripten_get_now();
      MD5_Update(&md5_ctx, buff, read_size);
      end = emscripten_get_now();
      duration += end - start;
    } else {
      break;
    }
  }
  start = emscripten_get_now();
  MD5_Final(md5_result, &md5_ctx);
  end = emscripten_get_now();
  duration += end - start;

  fclose(stream);
  free(buff);
  return duration;
}

EMSCRIPTEN_KEEPALIVE
int extract(char* path, void (*on_pathname)(const char*),
            void (*on_error)(const char*)) {
  struct archive* a;
  struct archive_entry* entry;
  int r;

  a = archive_read_new();
  archive_read_support_filter_all(a);
  archive_read_support_format_all(a);
  r = archive_read_open_filename(a, path, 10240);
  if (r == ARCHIVE_OK) {
    while (1) {
      r = archive_read_next_header(a, &entry);
      if (r != ARCHIVE_OK) {
        break;
      }
      on_pathname(archive_entry_pathname(entry));
    }
  }
  if (r != ARCHIVE_OK && r != ARCHIVE_EOF) {
    on_error(archive_error_string(a));
    archive_read_free(a);
    return r;
  }
  r = archive_read_free(a);
  return r;
}

struct archive_callbacks {
  ssize_t (*read_callback)(const void** buff);
  void (*skip_callback)(int64_t* request, int64_t* result);
  void (*seek_callback)(int64_t* offset, int whence, int64_t* result);
  int (*close_callback)();
};

ssize_t read_callback(struct archive* a, void* client_data, const void** buff) {
  struct archive_callbacks* archive_callbacks = client_data;
  return (*archive_callbacks->read_callback)(buff);
}

int64_t skip_callback(struct archive* a, void* client_data, int64_t request) {
  struct archive_callbacks* archive_callbacks = client_data;
  int64_t result;
  int64_t* p_result = malloc(sizeof(int64_t));

  (*archive_callbacks->skip_callback)(&request, p_result);
  result = *p_result;
  free(p_result);
  return result;
}

int64_t seek_callback(struct archive* a, void* client_data, int64_t offset,
                      int whence) {
  struct archive_callbacks* archive_callbacks = client_data;
  int64_t result;
  int64_t* p_result = malloc(sizeof(int64_t));

  (*archive_callbacks->seek_callback)(&offset, whence, p_result);
  result = *p_result;
  free(p_result);
  return result;
}

int close_callback(struct archive* a, void* client_data) {
  struct archive_callbacks* archive_callbacks = client_data;
  return (*archive_callbacks->close_callback)();
}

EMSCRIPTEN_KEEPALIVE
void archive_prepare(struct archive* a, void* client_data) {
  struct archive_callbacks* archive_callbacks = client_data;
  archive_read_support_filter_all(a);
  archive_read_support_format_all(a);
  archive_read_set_read_callback(a, read_callback);
  archive_read_set_skip_callback(a, skip_callback);
  archive_read_set_seek_callback(a, seek_callback);
  archive_read_set_close_callback(a, close_callback);
  archive_read_set_callback_data(a, client_data);
}
