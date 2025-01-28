import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export const processVideo = async (inputPath: string): Promise<string> => {
  const outputDir = path.join(process.cwd(), 'public', 'videos', path.parse(inputPath).name);
  const outputPath = path.join(outputDir, 'playlist.m3u8');

  // Crear directorio si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    // Generar diferentes calidades
    const qualities = [
      ['-vf', 'scale=w=1280:h=720', '-b:v', '2800k'],  // 720p
      ['-vf', 'scale=w=854:h=480', '-b:v', '1400k'],   // 480p
      ['-vf', 'scale=w=640:h=360', '-b:v', '800k']     // 360p
    ];

    const ffmpegCommands = qualities.map((quality, index) => {
      return [
        '-i', inputPath,
        ...quality,
        '-c:v', 'h264',
        '-c:a', 'aac',
        '-ar', '48000',
        '-profile:v', 'main',
        '-crf', '20',
        '-sc_threshold', '0',
        '-g', '48',
        '-keyint_min', '48',
        '-hls_time', '6',
        '-hls_playlist_type', 'vod',
        '-b:a', '128k',
        '-max_muxing_queue_size', '1024',
        '-hls_segment_filename', path.join(outputDir, `${index}_%03d.ts`),
        path.join(outputDir, `${index}.m3u8`)
      ];
    });

    // Crear master playlist
    const masterPlaylist = '#EXTM3U\n' +
      '#EXT-X-VERSION:3\n' +
      qualities.map((quality, index) => {
        const [, resolution] = quality.join(' ').match(/scale=w=(\d+):h=(\d+)/) || [];
        const [, bitrate] = quality.join(' ').match(/(\d+)k/) || [];
        return `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(bitrate) * 1000},RESOLUTION=${resolution}\n${index}.m3u8`;
      }).join('\n');

    fs.writeFileSync(path.join(outputDir, 'master.m3u8'), masterPlaylist);

    // Procesar cada calidad
    const processes = ffmpegCommands.map(cmd => {
      const ffmpeg = spawn('ffmpeg', cmd);
      
      ffmpeg.stderr.on('data', (data) => {
        console.log(`FFmpeg Log: ${data}`);
      });

      return new Promise((resolve, reject) => {
        ffmpeg.on('close', (code) => {
          if (code === 0) {
            resolve(true);
          } else {
            reject(new Error(`FFmpeg process exited with code ${code}`));
          }
        });
      });
    });

    // Esperar a que todos los procesos terminen
    Promise.all(processes)
      .then(() => resolve(outputPath))
      .catch(reject);
  });
}; 