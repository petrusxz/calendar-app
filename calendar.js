class Calendar {

  constructor() {
    this.calendar = document.getElementById('calendar');
    this.activeMonth = document.getElementById('active-month');

    this.initializeDate();
    this.setEvents();
  }

  /**
   * @description Initializes the active date to the current date
   */
  initializeDate() {
    const today = new Date();
    this.activeDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.setCurrentMonthDates();
  }

  /**
   * @description Controls next, previous and current month iteration for the Calendar
   */
  setEvents() {
    const previousCtrl = document.getElementById('previous-ctrl');
    const nextCtrl = document.getElementById('next-ctrl');
    const todayCtrl = document.getElementById('today-ctrl');
    const calendarEvents = document.getElementById('calendar');

    previousCtrl.addEventListener('click', this.setCurrentMonthDates.bind(this, -1));
    nextCtrl.addEventListener('click', this.setCurrentMonthDates.bind(this, 1));
    todayCtrl.addEventListener('click', this.initializeDate.bind(this));
    calendarEvents.addEventListener('click', this.manageEvent.bind(this));
  }

  /**
   * @param {number} iterator 
   * @description Generates dates slots for the current month on the Calendar
   */
  setCurrentMonthDates(iterator = 0) {
    this.activeDate.setMonth(this.activeDate.getMonth() + iterator);
    const dt = new Date(this.activeDate.getFullYear(), this.activeDate.getMonth(), 1);
    dt.setDate(dt.getDate() - dt.getDay());

    let weekRow = document.createElement('tr');
    this.calendar.innerHTML = '';
    this.calendar.appendChild(weekRow);

    for (let i = 0; i < 42; i++) {
      const dateSlot = weekRow.insertCell();
      dateSlot.id = `date-${dt.getTime()}`;
      dateSlot.innerText = dt.getDate();

      if (dt.getMonth() !== this.activeDate.getMonth()) {
        dateSlot.className = 'other-month';
      }

      if (dt.getDay() === 6) {
        weekRow = document.createElement('tr');
        this.calendar.appendChild(weekRow);
      }

      dt.setDate(dt.getDate() + 1);
    }

    this.activeMonth.innerText = `${this.activeDate.toLocaleDateString('en', { month: 'short' })} ${this.activeDate.getFullYear()}`;
  }

  manageEvent(event) {
    const { id } = event.target;

    if (id === 'appointment-box') return;

    const appointmentBox = document.getElementById('appointment-box');
    if (appointmentBox) appointmentBox.remove();
    const appointment = document.createElement('form');
    appointment.className = 'new-appointment';
    appointment.id = 'appointment-box';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'appointment-box';
    input.autofocus = true;

    if (id === 'appointment') {
      input.value = event.target.innerText;
    }

    const confirmButton = document.createElement('button');
    confirmButton.innerText = 'OK';
    confirmButton.type = 'submit';
    confirmButton.id = 'appointment-box';

    appointment.appendChild(input);
    appointment.appendChild(confirmButton);
    appointment.addEventListener('submit', this.saveAppointment.bind(this));

    event.target.appendChild(appointment);
  }

  saveAppointment(event) {
    event.preventDefault();
    const { value } = event.target[0];

    if (!value) return;
    event.target.innerHTML = '';
    const parent = event.target.parentElement;
    const appointment = document.createElement('div');
    appointment.id = 'appointment';
    appointment.innerText = value;

    parent.appendChild(appointment);
    event.target.remove();
  }
}

new Calendar();