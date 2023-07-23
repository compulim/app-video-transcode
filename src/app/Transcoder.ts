import {
  FileSystemWritableFileStreamTarget as MPEG4FileSystemWritableFileStreamTarget,
  Muxer as MPEG4Muxer
} from 'mp4-muxer';

import {
  FileSystemWritableFileStreamTarget as WebMFileSystemWritableFileStreamTarget,
  Muxer as WebMMuxer
} from 'webm-muxer';

type TrancoderInit = {
  codec: 'h264' | 'vp9';
  height: number;
  width: number;
};

class Transcoder extends EventTarget {
  constructor(url: string, { codec, height, width }: TrancoderInit) {
    super();

    this.#url = url;

    this.#config = {
      // h.264 Level 5.1 (0x33) = 4K
      // https://en.wikipedia.org/wiki/Advanced_Video_Coding#Levels
      codec: codec === 'h264' ? 'avc1.420033' : 'vp09.00.10.08',
      bitrate: 20_000_000,
      // framerate: this.#frameRate,
      height,
      width
    };

    this.#start();
  }

  #config: VideoEncoderConfig;
  #url: string;

  async #start() {
    const isSupported = await VideoEncoder.isConfigSupported(this.#config);

    if (!isSupported) {
      return this.dispatchEvent(new ErrorEvent('error', { message: 'Video encode configuration is not supported.' }));
    }

    const muxer = new WebMMuxer({
      video: { codec: 'V_VP9', height: this.#config.height, width: this.#config.width }
    });

    const encoder = new VideoEncoder({
      error: (error: DOMException) =>
        this.dispatchEvent(new ErrorEvent('error', { message: `Failed to encode to video.\n\n${error.message}` })),
      output: (chunk, meta) => {
        muxer.addVideoChunk(chunk, meta as any);

        // this.#numBytesWritten += chunk.byteLength;
        // this.#numFlushes++;

        this.dispatchEvent(new Event('progress'));
      }
    });

    encoder.configure(this.#config);

    // How to seek to frame?
    // How to work with audio tracks?

    // const video = new HTMLVideoElement();

    // const stream = new MediaStream();

    // const video = stream.getVideoTracks()[0];
    // const capture = new ImageCapture(video);

    // capture.grabFrame();
  }
}
