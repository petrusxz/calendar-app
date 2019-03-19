class Calendar {

  constructor() {
    this.calendar = document.getElementById('calendar');
    this.activeMonth = document.getElementById('active-month');
    this.appointmentBox = document.getElementById('appointment-box');
    this.appointmentBox.addEventListener('submit', this.saveAppointment.bind(this));

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
   * @description Assign events to the next, previous and current month iteration controls in the Calendar
   */
  setEvents() {
    const previousCtrl = document.getElementById('previous-ctrl');
    const nextCtrl = document.getElementById('next-ctrl');
    const todayCtrl = document.getElementById('today-ctrl');
    const calendarEvents = document.getElementById('calendar');

    previousCtrl.addEventListener('click', this.setCurrentMonthDates.bind(this, -1));
    nextCtrl.addEventListener('click', this.setCurrentMonthDates.bind(this, 1));
    todayCtrl.addEventListener('click', this.initializeDate.bind(this));
    calendarEvents.addEventListener('click', this.openEventManagementBox.bind(this));
  }

  /**
   * @param {number} iterator 
   * @description Generates dates for the current month on the Calendar
   */
  setCurrentMonthDates(iterator = 0) {
    this.calendar.innerHTML = '';

    this.activeDate.setMonth(this.activeDate.getMonth() + iterator);
    this.generateDateCells();
    this.changeMonthLabel();
  }

  /**
   * Creates date cells divided by row (week)
   */
  generateDateCells() {
    const dateHelper = new Date(this.activeDate.getFullYear(), this.activeDate.getMonth(), 1);
    dateHelper.setDate(dateHelper.getDate() - dateHelper.getDay());

    let weekRow = document.createElement('tr');
    this.calendar.appendChild(weekRow);

    for (let i = 0; i < 42; i++) {
      const dateCell = weekRow.insertCell();
      dateCell.id = `date-${dateHelper.getTime()}`;
      dateCell.innerText = dateHelper.getDate();
      
      const value = localStorage.getItem(dateCell.id);

      if (value) {
        const appointment = this.generateAppointmentDiv(value);
        dateCell.appendChild(appointment);
      }

      if (dateHelper.getMonth() !== this.activeDate.getMonth()) {
        dateCell.className = 'other-month';
      }

      if (dateHelper.getDay() === 6 && i < 41) {
        weekRow = document.createElement('tr');
        this.calendar.appendChild(weekRow);
      }

      dateHelper.setDate(dateHelper.getDate() + 1);
    }
  }

  /**
   * Changes the month label at the top of the Calendar
   */
  changeMonthLabel() {
    this.activeMonth.innerText = `${this.activeDate.toLocaleDateString('en', { month: 'short' })} ${this.activeDate.getFullYear()}`;
  }

  /**
   * Creates an edit box for the appointment's description for the selected date
   * @param {MouseEvent} event 
   */
  openEventManagementBox(event) {
    const {
      id
    } = event.target;
    if (id === 'appointment-box') return;

    this.appointmentBox.hidden = false;
    this.appointmentBox[0].value = (id === 'appointment') ? event.target.innerText : '';
    setTimeout(() => this.appointmentBox[0].focus(), 0);
    event.target.appendChild(this.appointmentBox);
  }

  /**
   * Saves appointments for the selected date
   * @param {MouseEvent} event 
   */
  saveAppointment(event) {
    event.preventDefault();

    const { value } = event.target[0];
    if (!value) return;

    const parent = event.target.parentElement;
    const appointment = this.generateAppointmentDiv(value);

    const { id } = event.target.parentNode;
    localStorage.setItem(id, value);

    event.target[0].value = '';
    this.appointmentBox.hidden = true;

    parent.appendChild(appointment);
  }

  /**
   * Generates appointment element with the given value
   * @param {string} value 
   */
  generateAppointmentDiv(value) {
    const appointment = document.createElement('div');
    appointment.id = 'appointment';
    appointment.innerText = value;

    return appointment;
  }
}

new Calendar();