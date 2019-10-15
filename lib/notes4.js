
// Define a client function that calls for data from the server.
const fetchPromise = fetch(url, params)
.then
(
  (res) => 
  {
    // Verify that we have some sort of 2xx response that we can use
    if (!res.ok) 
    {
      throw res;
    }

    // If no content, immediately resolve, don't try to parse JSON
    if (res.status === 204) 
    {
      return;
    }

    // Initialize variable to hold chunks of data as they come across.
    let textBuffer = '';

    // This does not seem to be use. Delete this after everything else is working.
    const self = this;

    // Process the stream.
    return res.body

    // Decode as UTF-8 Text
    .pipeThrough
    (
      new TextDecoderStream()
    )

    // Split on lines
    .pipeThrough
    (
      new TransformStream
      (
        {
          transform(chunk, controller) 
          {
            textBuffer += chunk;

            const lines = textBuffer.split('\n');

            for (const line of lines.slice(0, -1)) 
            {
              controller.enqueue(line);
            } // End of: for (const line ...)

            textBuffer = lines.slice(-1)[0];
          }, // End of: Transform(chunk, controller){do stuff}

          flush(controller) 
          {
            if (textBuffer) 
            {
              controller.enqueue(textBuffer);
            } // End of: if (textBuffer)
          } // End of: flush(controller){do stuff}
        } // End of: parameters for new TransformStream
      ) // End of: call to constructor new TransformStream
    ) // End of: parameters for pipeThrough - Split on lines

    // Parse JSON objects
    .pipeThrough
    (
      new TransformStream
      (
        {
          transform(line, controller) 
          {
            if (line) 
            {
              controller.enqueue
              (
                JSON.parse(line)
              ); //End of: call to controller.enqueue function
            } // End of: if (line)
          } // End of: transform function
        } // End of: parameter object for new TransformStream
      ) // End of: new TransformStream parameters
    ); // End of: parameters for .pipeThrough - Parse JSON objects
  } // End of: .then callback function instruction for fetch
); // End of: .then callback parameters for fetch


// Call to function which asks server for data.
const res = await fetchPromise;

const reader = res.getReader();

function read() 
{
  reader.read()
  .then
  (
    ({value, done}) => 
    {
      if (value) {
        // Your object will be here
      }
      if (done) {
        return;
      }
      read();
    }
  );
}

read();