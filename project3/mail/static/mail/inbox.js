const DJANGO_STATIC_URL = '/static/';

document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', ()=> compose_email());

  // Add event listener to form for submit
  document.querySelector('#compose-form').onsubmit = () => send_email();

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(email) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single_email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  let recipients = '';
  let subject = '';
  let body = '';

  // If user wants to reply
  if (email) {
    console.log(email)
    recipients = email.sender;
    if (email.subject.substring(0, 4) != 'Re: ') {
      subject = 'Re: ' + email.subject;
      body = 'On ' + email.timestamp + ' ' + email.sender + ' wrote:\n' + email.body + '\n\n';
    }
    else {
      subject = email.subject;

      let replies = email.body.split('\n\n');

      // New body consists of all previous replies along with the last reply + timestamp
      for (let i = 0; i < replies.length - 1; i++) {
        body += replies[i] + '\n\n';
      }
      body += 'On ' + email.timestamp + ' ' + email.sender + ' wrote:\n' + replies[replies.length - 1] + '\n\n';
    }
  }

  // Fill out composition fields
  document.querySelector('#compose-recipients').value = recipients;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;
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
      emails.forEach(email => {
        create_mail_element(email);
      });
    });
}

function load_email(email, from) {

  // Hide mailbox and compose
  document.querySelector("#emails-view").style.display = 'none';
  document.querySelector("#compose-view").style.display = 'none';
  document.querySelector('#single_email-view').style.display = 'block';

  const container = document.querySelector('#single_email-view');

  // Clear div (delete last loaded email)
  container.innerHTML = '';

  // Create email element
  container.append(create_element('sender', email.sender, container));
  container.append(create_element('subject', email.subject, container));
  container.append(create_element('body', email.body, container));
  container.append(create_element('timestamp', email.timestamp, container));

  // Create archive button only if email is in inbox or archived
  if (from !== 'sent') container.append(create_archive_button(email.id, email.archived));

  // Create reply button
  let button = document.createElement('button');
  button.innerHTML = 'Reply';
  button.classList.add('btn', 'btn-secondary');

  // Add event listener to reply button
  button.addEventListener('click', () => {
    compose_email(email);
  });

  // Add reply button to container
  container.append(button);
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
    .then(() => {
      load_mailbox('sent');
    });

  return false;
}

function create_mail_element(email) {
  const email_row = document.createElement('div');
  email_row.classList.add('email');

  let src = DJANGO_STATIC_URL + 'images/unread.png';

  // If email is read change icon and add background color
  if (email.read) {
    email_row.classList.add('read');
    src = DJANGO_STATIC_URL + 'images/read.png';
  }

  let image = document.createElement('img');
  image.src = src;

  // Add icon before each email's content
  const icon = document.createElement('div');
  icon.classList.add('icon');
  icon.append(image);

  // Add event listener to icon to change read/unread
  icon.addEventListener('click', () => {
    mark_email_as_read(email.id, !email.read, true);
  });

  email_row.append(icon);

  const contents = create_element('contents', '');

  // Create each part of email content
  contents.append(create_element('sender', email.sender));
  contents.append(create_element('subject', email.subject));
  contents.append(create_element('timestamp', email.timestamp));

  // Add event listener to email element
  contents.addEventListener('click', () => {
    mark_email_as_read(email.id, true);
    get_email(email.id);
  });

  // Add contents to email row
  email_row.append(contents);

  // Add row to main container
  document.querySelector('#emails-view').append(email_row);
}

function create_element(type, content) {

  // Create separate div for each part of email
  let element = document.createElement('div');
  element.innerHTML = content;
  element.classList.add(type);

  return element;
}

function create_archive_button(id, archived) {

  // Create button
  let button = document.createElement('button');
  if (archived) button.innerHTML = 'Unarchive';
  else button.innerHTML = 'Archive';
  button.classList.add('btn', 'btn-primary');

  // Add event listener
  button.addEventListener('click', () => {
    // Change current state
    mark_email_as_archived(id, !archived);
  });

  return button;
}

function get_email(id) {
  fetch('/emails/' + id)
    .then(response => response.json())
    .then(email => {
      let from = document.querySelector('h3').innerHTML.toLowerCase();
      load_email(email, from);
    });
}

function mark_email_as_read(id, read, from_icon) {
  fetch('/emails/' + id, {
    method: 'PUT',
    body: JSON.stringify({
      read: read
    })
  }).then(() => {
    if (from_icon) {
      load_mailbox(document.querySelector('h3').innerHTML.toLowerCase());
    }
  });
}

function mark_email_as_archived(id, archived) {
  fetch('/emails/' + id, {
    method: 'PUT',
    body: JSON.stringify({
      archived: archived
    })
  })
    .then(() => {
      load_mailbox('inbox');
    });
}