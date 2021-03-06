const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages');

// template
const messageTemplate = document.querySelector('#message-template').innerHTML;
const messageLocationTemplate = document.querySelector('#messageLocation-template').innerHTML;

//options

const {username, room} = Qs.parse(location.search,{ ignoreQueryPrefix: true})

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate,{
        message:message.text,
        createdAt: moment(message.createdAt).format('h:mm a'),
        username: message.username
    });
    $messages.insertAdjacentHTML('beforeend',html);
})

socket.on('locationMessage', (locationMessageUrl) => {
    console.log("locationMessageUrl =", locationMessageUrl);
    const html = Mustache.render(messageLocationTemplate,{
        locationMessageUrl:locationMessageUrl.text,
        createdAt: moment(locationMessageUrl.createdAt).format('h:mm a'),
        username: locationMessageUrl.username
    });
    $messages.insertAdjacentHTML('beforeend',html);
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})


socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})