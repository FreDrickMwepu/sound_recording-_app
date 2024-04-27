// record.js

document.addEventListener('DOMContentLoaded', function() {
    let wavesurfer;
    let record;
    let scrollingWaveform = false;

    // Function to create WaveSurfer instance
    const createWaveSurfer = () => {
        // Destroy existing WaveSurfer instance if any
        if (wavesurfer) {
            wavesurfer.destroy();
        }

        // Create new WaveSurfer instance
        wavesurfer = WaveSurfer.create({
            container: '#mic',
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)'
        });

        // Initialize the Record plugin
        record = wavesurfer.registerPlugin(
            WaveSurfer.recordPlugin.create({
                scrollingWaveform,
                renderRecordedAudio: false
            })
        );

        // Event listener for when recording ends
        record.on('record-end', blob => {
            const container = document.querySelector('#recordings');
            const recordedUrl = URL.createObjectURL(blob);

            // Create WaveSurfer instance for recorded audio
            const recordedWaveSurfer = WaveSurfer.create({
                container,
                waveColor: 'rgb(200, 100, 0)',
                progressColor: 'rgb(100, 50, 0)',
                url: recordedUrl
            });

            // Play button for recorded audio
            const playButton = container.appendChild(document.createElement('button'));
            playButton.textContent = 'Play';
            playButton.onclick = () => recordedWaveSurfer.playPause();
            recordedWaveSurfer.on('pause', () => (playButton.textContent = 'Play'));
            recordedWaveSurfer.on('play', () => (playButton.textContent = 'Pause'));

            // Download link for recorded audio
            const downloadLink = container.appendChild(document.createElement('a'));
            downloadLink.href = recordedUrl;
            downloadLink.download = 'recording.' + (blob.type.split(';')[0].split('/')[1] || 'webm');
            downloadLink.textContent = 'Download recording';
        });

        // Update progress during recording
        record.on('record-progress', time => {
            updateProgress(time);
        });

        // Get available audio devices for microphone selection
        const micSelect = document.querySelector('#mic-select');
        WaveSurfer.recordPlugin
            .getAvailableAudioDevices()
            .then(devices => {
                devices.forEach(device => {
                    const option = document.createElement('option');
                    option.value = device.deviceId;
                    option.text = device.label || device.deviceId;
                    micSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error getting audio devices:', error);
            });
    };

    // Function to update progress during recording
    const updateProgress = time => {
        const formattedTime = [
            Math.floor((time % 3600000) / 60000), // minutes
            Math.floor((time % 60000) / 1000) // seconds
        ]
            .map(v => (v < 10 ? '0' + v : v))
            .join(':');
        document.querySelector('#progress').textContent = formattedTime;
    };

    // Event listener for mic selection
    document.querySelector('input[type="checkbox"]').onclick = e => {
        scrollingWaveform = e.target.checked;
        createWaveSurfer();
    };

    // Event listener for record button
    document.querySelector('#record').onclick = () => {
        if (record && (record.isRecording() || record.isPaused())) {
            record.stopRecording();
            document.querySelector('#record').textContent = 'Record';
            document.querySelector('#pause').style.display = 'none';
            return;
        }

        document.querySelector('#record').disabled = true;

        // Get selected audio device
        const deviceId = document.querySelector('#mic-select').value;

        // Start recording
        record
            .startRecording({ deviceId })
            .then(() => {
                document.querySelector('#record').textContent = 'Stop';
                document.querySelector('#record').disabled = false;
                document.querySelector('#pause').style.display = 'inline';
            })
            .catch(error => {
                console.error('Error starting recording:', error);
                document.querySelector('#record').disabled = false;
            });
    };

    // Event listener for pause button
    document.querySelector('#pause').onclick = () => {
        if (record.isPaused()) {
            record.resumeRecording();
            document.querySelector('#pause').textContent = 'Pause';
        } else {
            record.pauseRecording();
            document.querySelector('#pause').textContent = 'Resume';
        }
    };

    // Initialize WaveSurfer
    createWaveSurfer();
});
