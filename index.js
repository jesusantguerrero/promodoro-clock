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
    round: 0
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
    }
  },
    
  methods: {
    play(){
      switch (this.run) {
        case 0:
          this.initTimer('session');
          this.run = 1
          this.icon = 'pause'
          break
        case 1:
          this.stop()
          break
        case 2:
          this.initTimer()
          this.icon = 'pause'
          this.run = 1
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
      this.updateTime(time.minutes, time.seconds)
    },
    
    clear(){
      this.stop()
      if (this.round == 0){
       this.initTimer('rest')
       this.round = 1
      } else {
        this.round = 0
        this.run = 0
      }
    },
    
    initTimer(mode = 'resume') {
      const self = this
      switch(mode){
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
       }      
      } else {
        this.time.seconds--
      }
    },
    
    addTime(property){
      const self = this
      this[property]++
      if (property == 'session') {
        self.updateTime(this[property])
      }
      this.stop()
    },
    
    removeTime(property){
      const self = this
      this[property]--
      if (property == 'session') {
        self.updateTime(this[property])
      }
      this.stop()
    },
   
    updateTime(mins, secs = 00){
      this.time.minutes = mins;
      this.time.seconds = secs;
    }
  }
})