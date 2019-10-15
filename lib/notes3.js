const fetchPromise = fetch(url, params).then((res) => {
  // Verify that we have some sort of 2xx response that we can use
  if (!res.ok) {
    throw res;
  }

  // If no content, immediately resolve, don't try to parse JSON
  if (res.status === 204) {
    return;
  }

  let textBuffer = '';

  const self = this;

  return res.body
    // Decode as UTF-8 Text
    .pipeThrough(new TextDecoderStream())

    // Split on lines
    .pipeThrough(new TransformStream({
      transform(chunk, controller) {
        textBuffer += chunk;
        const lines = textBuffer.split('\n');
        for (const line of lines.slice(0, -1)) {
          controller.enqueue(line);
        }
        textBuffer = lines.slice(-1)[0];
      },
      flush(controller) {
        if (textBuffer) {
          controller.enqueue(textBuffer);
        }
      }
    }))

    // Parse JSON objects
    .pipeThrough(new TransformStream({
      transform(line, controller) {
        if (line) {
          controller.enqueue(
            JSON.parse(line)
          );
        }
      }
    }));
});










  const res = await fetchPromise;
  const reader = res.getReader();
  function read() {
    reader.read().then(({value, done}) => {
      if (value) {
        // Your object will be here
      }
      if (done) {
        return;
      }
      read();
    });
  }
  read();