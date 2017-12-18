const time= {minutes: 25, seconds: 00}
const promodoroApp = new Vue({
  el: '#promodoro-app',
  data: {
    time,
    session: 25,
    rest: 5,
    icon: 'play_arrow',
    run: 0,
    timer: '',
    round: 0,
    audio: '',
    mode: 'session'
  },
  mounted(){
    this.audio = document.querySelector('#audio')
  },
  
  filters:{
    getTime(val) {
      let {minutes, seconds} = val
      seconds = (seconds < 10) ? seconds = '0'+ seconds : seconds
      minutes = (minutes < 10) ? minutes = '0' + minutes: minutes
      return `${minutes}:${seconds}`
    }
  },
  
  computed: {
    mode() {
      return (this.round == 0) ? 'Session' : 'Rest'
    },
    
    message() {
      switch(this.run){
        case 0:
          return 'start'
        case 1:
          return 'pause'
        case 2:
          return 'resume'
      }
    }
  },
    
  methods: {
    play(){
      this.stopSound()
      switch (this.run) {
        case 0:
          this.initTimer();
          break
        case 1:
          this.stop()
          break
        case 2:
          this.initTimer()
          break
      }
    },
    
    stop(){
      clearInterval(this.timer)
      this.run = 2
      this.icon = 'play_arrow'
    },
    
    reset() {
      this.stop()
      this.run = 0
      this.round = 0
      this.time = {minutes: 25, seconds: 0}
      this.session = 25
      this.rest = 5
      this.mode = 'session'
    },
    
    clear(){
      this.stop()
      if (this.round == 0) {
        this.setRestMode()
        this.round = 1
      } else {
        this.round = 0
        this.run = 0
      }
    },
    
    initTimer() {
      this.run = 1
      this.icon = 'pause'
      const self = this
      switch(this.mode){
        case 'session':
          this.time.minutes = this.session
          break
        case 'rest':
          this.time.minutes = this.rest
          break
      }
      this.timer = setInterval(()=> {
        self.countDown()
      }, 1000)
    
    },
  
    countDown() {
      if (this.time.seconds == 0) {
         this.time.minutes--
         if (this.time.minutes >= 0) {
            this.time.seconds = 59  
          } else {
            this.clear()
            this.playSound()
          }      
      } else {
        this.time.seconds--
      }
    },
    
    addTime(property){
      const self = this
      this[property]++
      
      if (property == 'session' && this.round == 0) {
        self.updateTime(this[property])
      } else if (property == 'rest' && this.round == 1) {
        self.updateTime(this[property])
      }
      
      this.stop()
    },
    
    removeTime(property){
      const self = this
      if (this[property] > 0) {
        this[property]-- 
      }
      
      if (property == 'session' && this.round == 0) {
        self.updateTime(this[property])
      } else if (property == 'rest' && this.round == 1) {
        self.updateTime(this[property])
      }
      
      this.stop()
    },
   
    updateTime(mins, secs = 00){
      this.time.minutes = mins;
      this.time.seconds = secs;
    },
    
    playSound(){
      const self = this
      this.audio.currentTime = 0
      this.audio.play()
      setTimeout(() => {
        this.audio.pause()
      }, 10000)
    },

    stopSound() {
      this.audio.pause()
    },
    
    setRestMode() {
      this.mode = 'rest'
      this.time.minutes = this.rest
    }
  }
})