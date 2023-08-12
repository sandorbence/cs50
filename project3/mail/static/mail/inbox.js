document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Add event listener to form for submit
  document.querySelector('#compose-form').onsubmit = () => send_email();

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single_email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single_email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Get emails in mailbox
  fetch('/emails/' + mailbox)
    .then(response => response.json())
    .then(emails => {
      console.log(emails);

      emails.forEach(email => {
        console.log(email.body);
        create_mail_element(email);
      });
    });
}

function load_email(email) {

  // Hide mailbox and compose
  document.querySelector("#emails-view").style.display = 'none';
  document.querySelector("#compose-view").style.display = 'none';
  document.querySelector('#single_email-view').style.display = 'block';

  const container = document.querySelector('#single_email-view');

  // Clear div (delete last loaded email)
  container.innerHTML = '';

  // Create email element
  container.append(create_element('sender', email.sender));
  container.append(create_element('subject', email.subject));
  container.append(create_element('body', email.body));
  container.append(create_element('timestamp', email.timestamp));
}

function send_email() {

  // Get data from form
  let recipients = document.querySelector('#compose-recipients').value;
  let subject = document.querySelector('#compose-subject').value;
  let body = document.querySelector('#compose-body').value;

  // Add email to database
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      load_mailbox('sent');
    });

  return false;
}

function create_mail_element(email) {
  let element = document.createElement('div');
  element.classList.add('email');
  if (email.read) element.classList.add('read');

  // Create each part of email element
  element.append(create_element('sender', email.sender));
  element.append(create_element('subject', email.subject));
  element.append(create_element('timestamp', email.timestamp));

  // Add event listener to email element
  element.addEventListener('click', () => {
    get_email(email.id);
  });

  // Add element to main container
  document.querySelector('#emails-view').append(element);
}

function create_element(type, text) {

  // Create separate div for each part of email
  let element = document.createElement('div');
  element.innerHTML = text;
  element.classList.add(type);

  return element;
}

function get_email(id) {
  fetch('/emails/' + id)
    .then(response => response.json())
    .then(email => {
      console.log(email);

      load_email(email);
    });
}