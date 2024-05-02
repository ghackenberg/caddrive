export class AudioRecorder {

    private active = false
    private stream: MediaStream
    private recorder: MediaRecorder
    private slices: Blob[]

    public async start() {
        if (!this.active) {
            // Set active
            this.active = true
            // Set slices
            this.slices = []
            // Create stream
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            // Create recorder
            this.recorder = new MediaRecorder(this.stream)
            this.recorder.addEventListener('dataavailable', event => {
                this.slices.push(event.data)
            })
            this.recorder.start()
        }
    }

    public async stop() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise<Blob>((resolve, _reject) => {
            // TODO handle error and remove eslint comment

            // Stop recorder
            this.recorder.addEventListener('stop', () => {
                // Merge slices
                const merged = new Blob(this.slices, { type: this.recorder.mimeType })
                // Resolve promise
                resolve(merged)
                // Reset stream
                this.stream = null
                // Reset recorder
                this.recorder = null
                // Reset active
                this.active = false
            })
            this.recorder.stop()
            // Stop stream
            for (const track of this.stream.getTracks()) {
                track.stop()
            }
        })
    }

}